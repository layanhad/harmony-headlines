import "./ArticlePage.css";
import { useParams } from "react-router-dom";
import  newsData  from "../../data/newsData";
export default function ArticlePage() {
    const { id } = useParams();
    const article = newsData.find((news) => news.id === parseInt(id));
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
            </div>
        </div>
    );
}
