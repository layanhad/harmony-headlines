import "./NewsPage.css";
import NewsCard from "../../components/NewsCard/NewsCard";
import newsData from "../../data/newsData";

export default function NewsPage() {
    return (
        <div className="news-page">
            {newsData.map((news) => (
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
        </div>
    )
}