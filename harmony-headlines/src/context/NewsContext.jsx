import { createContext, useState, useEffect } from "react";
import { getNews } from "../utils/getNews";
import { processTitleMood, changeMood } from "../utils/processNewsLLM";
import { DEFAULT_IMG, LOCAL_STORAGE_KEY } from "../utils/constants";

export const NewsContext = createContext();

export function NewsProvider({ children }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dailyRequestCount, setDailyRequestCount] = useState(0);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getNews();
            const titles = data.data.map(article => article.title);

            // Process sentiment scores with batching and rate limiting
            const sentimentScores = await analyzeTitles(titles);

            // Combine processed data
            const processedNews = data.data.map((article, index) => ({
                id: article.id || index,
                title: article.title,
                date: article.published_at,
                author: article.author,
                img: article.image || DEFAULT_IMG,
                description: article.description,
                source: article.source,
                sentimentScore: sentimentScores[index],
            }));

            // Save to localStorage and state
            localStorage.setItem(LOCAL_STORAGE_KEY.toString(), JSON.stringify(processedNews));
            setNews(processedNews);
        } catch (err) {
            console.error("Error fetching news:", err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeTitles = async (titles) => {

        if (!Array.isArray(titles) || titles.length === 0) {
            console.warn("No titles to analyze.");
            return [];
        }
    
        const batchSize = 5; // Batch size for processing
        const delay = 30000; // 30 seconds delay for rate limiting
        const scores = [];
        const sentimentCache = {}; // Cache for sentiment results

        // Helper function to process a batch
        const processBatch = async (batch) => {
            try {
                if (dailyRequestCount >= 50) {
                    console.warn("Daily request limit reached. Falling back to local sentiment analysis.");
                }

                const result = await processTitleMood(batch);
                setDailyRequestCount((count) => count + 1); // Increment request count
                batch.forEach((title, index) => {
                    sentimentCache[title] = result[index]; // Cache the result
                });
                return result;
            } catch (error) {
                console.error("Error processing batch:", error);
                return [];
            }
        };

        // Process titles in batches
        for (let i = 0; i < titles.length; i += batchSize) {
            const batch = titles.slice(i, i + batchSize);
            const batchScores = await processBatch(batch);
            scores.push(...batchScores);

            if (i + batchSize < titles.length) {
                await new Promise((resolve) => setTimeout(resolve, delay)); // Rate limiting delay
            }
        }

        return scores;
    };

    const updateArticleMood = async (id) => {
        const article = news.find((item) => item.id === id);
        if (!article) return;

        try {
            const updated = await changeMood({
                title: article.title,
                description: article.description,
            });

            // Update article mood
            const updatedNews = news.map((item) =>
                item.id === id ? { ...item, ...updated } : item
            );

            // Reanalyze sentiment
            const newScore = await processTitleMood([updated.title]);
            const finalNews = updatedNews.map((item) =>
                item.id === id ? { ...item, sentimentScore: newScore[0] } : item
            );

            // Update state and localStorage
            setNews(finalNews);
            localStorage.setItem(LOCAL_STORAGE_KEY.toString(), JSON.stringify(finalNews));
        } catch (err) {
            console.error("Error updating article mood:", err);
        }
    };

    useEffect(() => {
        const savedNews = localStorage.getItem(LOCAL_STORAGE_KEY.toString());
        console.log("Saved news from localStorage:", savedNews);

        if (savedNews && savedNews !== "[]") {
            setNews(JSON.parse(savedNews));
        } else {
            fetchNews();
        }
    }, []);

    return (
        <NewsContext.Provider
            value={{ news, loading, fetchNews, analyzeTitles, updateArticleMood }}
        >
            {children}
        </NewsContext.Provider>
    );
}
