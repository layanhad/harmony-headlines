import "./NewsCard.css";
import {Link} from "react-router-dom";
export default function NewsCard({id,img, title, date, author,source}) {
    return (
            <div className="news-card">
                <div className="news-card-content">
                    <h3 className="news-card-title">{title}</h3>
                    <div className="news-card-meta">
                        <span className="news-card-author">{author}</span>
                        <span className="news-card-date">· {date}</span>
                    </div>
                    <p className="news-card-source">{source}</p>
                </div>
                <Link to = {`/news/${id}`}>
                     <img className="news-card-image" src={img} alt="news image" />
                </Link>
            </div>
    )
}