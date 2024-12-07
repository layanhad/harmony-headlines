import { createContext, useState, useEffect } from "react";
import { DEFAULT_IMG, LOCAL_STORAGE_KEY,VITE_BACKEND_URL } from "../utils/constants";

export const NewsContext = createContext();

export function NewsProvider({ children }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${VITE_BACKEND_URL}/news`);
            const data = await response.json();

            if (!data || !data.data || !Array.isArray(data.data)) {
                console.warn("Unexpected response format:", data);
                setNews([]); 
                return;
            }
    
            const titles = data.data.map((article) => article.title);
            const sentimentScores = await analyzeTitles(titles);

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

        try {
            const response = await fetch(`${VITE_BACKEND_URL}/analyze-mood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titles }),
            });

            const { moods } = await response.json();
            return moods;
        } catch (err) {
            console.error("Error analyzing titles:", err);
            return [];
        }
    };

    const updateArticleMood = async (id) => {
        const article = news.find((item) => item.id === id);
        if (!article) return;

        try {
            const response = await fetch(`${VITE_BACKEND_URL}/update-mood`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: article.title,
                    description: article.description,
                }),
            });

            const updated = await response.json();
            const updatedNews = news.map((item) =>
                item.id === id ? { ...item, ...updated } : item
            );

            const newScore = await analyzeTitles([updated.title]);
            const finalNews = updatedNews.map((item) =>
                item.id === id ? { ...item, sentimentScore: newScore[0] } : item
            );

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
            console.log("Fetching news...");
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
