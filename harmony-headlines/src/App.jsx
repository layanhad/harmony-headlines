import './App.css'
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import NewsPage from './pages/NewsPage/NewsPage'
import ArticlePage from './pages/ArticlePage/ArticlePage'
import HomePage from './pages/HomePage/HomePage';
import NewsLayout from './components/Layout/NewsLayout';
import { NewsProvider } from "./context/NewsContext";
import Header from './components/Header/Header';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    }
    ,
    {
      path: "/news",
      element: <NewsLayout />,
      children: [
        {
          index: true,
          element: <NewsPage />,
        },
        {
          path: ":id",
          element: <ArticlePage />,
        }
      ]

    }
    
  ])

  return (
    <NewsProvider>
      <Header />
      <RouterProvider router={router} />
    </NewsProvider>

  )
}

export default App
