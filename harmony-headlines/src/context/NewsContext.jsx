import { createContext, useState, useEffect } from "react";
import { getNews } from "../utils/getNews";
import { processTitleMood, changeMood } from "../utils/processNewsLLM";
import { DEFAULT_IMG, LOCAL_STORAGE_KEY} from "../utils/constants";

export const NewsContext = createContext();

export function NewsProvider({ children }) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await getNews();
            const promises = data.data.map(async (article, index) => {
                const score = await processTitleMood([article.title]);
                return {
                    id: article.id || index,
                    title: article.title,
                    date: article.published_at,
                    author: article.author,
                    img: article.image || DEFAULT_IMG,
                    description: article.description,
                    source: article.source,
                    sentimentScore: score[0],
                };
            });
            const processedNews = await Promise.all(promises);

            localStorage.setItem(LOCAL_STORAGE_KEY.toString(), JSON.stringify(processedNews));

            setNews(processedNews);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const analyzeSentiments = async () => {
        const titles = news.map((item) => item.title);
        try {
            const scores = await processTitleMood(titles);
            const updatedNews = news.map((item, index) => ({
                ...item,
                sentimentScore: scores[index],
            }));
            setNews(updatedNews);

            localStorage.setItem(LOCAL_STORAGE_KEY.toString(), JSON.stringify(updatedNews));
        } catch (err) {
            console.error("Error analyzing sentiments:", err);
        }
    };

    const updateArticleMood = async (id) => {
        const article = news.find((item) => item.id === id);
        if (!article) return;

        try {
            const updated = await changeMood({
                title: article.title,
                description: article.description,
            });

            const updatedNews = news.map((item) =>
                item.id === id ? { ...item, ...updated } : item
            );

            setNews(updatedNews);

            const newScore = await processTitleMood([updated.title]);
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
            fetchNews();
        }
    }, []);

    return (
        <NewsContext.Provider
            value={{ news, loading, fetchNews, analyzeSentiments, updateArticleMood }}
        >
            {children}
        </NewsContext.Provider>
    );
}
