import { Outlet } from "react-router-dom";
export default function NewsLayout() {
    return (
        <div className="news-layout">
            <Outlet />
        </div>
    );
}