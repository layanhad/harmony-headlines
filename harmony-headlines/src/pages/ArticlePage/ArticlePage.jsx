import "./ArticlePage.css";
import { useParams,Link } from "react-router-dom";
import  newsData  from "../../data/newsData";
import { useContext } from "react";
import { NewsContext } from "../../context/NewsContext";

export default function ArticlePage() {
    const { id } = useParams();
    const { news, updateArticleMood } = useContext(NewsContext);
    const article = news.find((newsItem) => newsItem.id === parseInt(id));

    if (!article) return <p>Article not found.</p>;

        return (
        <div className="article-page">
            <div className="article-header">
                <img className="article-image" src={article.img} alt={article.title} />
            </div>
            <div className="article-content">
                <h1 className="article-title">{article.title}</h1>
                <div className="article-meta">
                    <span className="article-author">{article.author}</span>
                    <span className="article-date">· {article.date}</span>
                </div>
                <p className="article-source">Source: {article.source}</p>
                <p className="article-description">{article.description}</p>
                <p className="articale-score">sentimentScore: {article.sentimentScore}</p>
                <button className="score-button" onClick={() => updateArticleMood(article.id)}>
                    Make Article Kinder
                </button>
                <Link to="/news">
                    <button className="back-button">Go back</button>
                </Link>
            </div>
        </div>
    );
}
