import "./HomePage.css";
import buildings from "../../assets/buildings.png";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="home-page">
            <div className="home-header">
                <img
                    className="home-image" src={buildings} alt="Cityscape"/>
            </div>
            <div className="home-content">
                <h1 className="home-title">Get The Latest News And Updates</h1>
                <p className="home-description">
                    From Politics to Entertainment: Your One-Stop Source for Comprehensive Coverage of the Latest News
                    and Developments Across the Globe will be right on your hand.
                </p>
                <Link to="/news">
                    <button className="home-button">Explore →</button>
                </Link>        
            </div>
    </div>
    );
}