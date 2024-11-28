import "./NewsPage.css";
import NewsCard from "../../components/NewsCard/NewsCard";
import newsData from "../../data/newsData";
import { useContext,useEffect } from "react";
import {NewsContext} from "../../context/NewsContext"
import {Link } from "react-router-dom";


export default function NewsPage() {
    const { news, loading, analyzeSentiments } = useContext(NewsContext);
    useEffect(() => {
        analyzeSentiments(); 
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="news-page">
            {news.map((news) => (
                <NewsCard
                    key={news.id}
                    id={news.id}
                    title={news.title}
                    date={news.date}
                    author={news.author}
                    img={news.img}
                    source={news.source}
                />
            ))}

            <Link to="/">
                    <button className="back-button">Go back</button>
            </Link>
        </div>
    )
}