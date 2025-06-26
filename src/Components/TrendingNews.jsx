import React, { useState, useEffect, useRef } from 'react';
import { FaPhone } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import '../Styles/TrendingNews.css';

const TrendingNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchFormRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("https://fish-backend-1-mb5j.onrender.com/news");
        setNewsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch news", error);
        setError("Unable to load news. Please try again later.");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const getTagClass = (tag) => {
    const colors = {
      "Fishing News": "tag-blue",
      "Weather": "tag-red",
    };
    return colors[tag] || "tag-blue";
  };

  const handleToggle = () => {
    searchFormRef.current.classList.toggle("search-active");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchInputRef.current.value = "";
      searchFormRef.current.classList.remove("search-active");
    }
  };

  if (loading) {
    return (
      <div className="news-loading">
        <div className="loading-spinner"></div>
        <p>Loading latest news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-error">
        <p>⚠️ {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="search-container">
        <form className="search-form" ref={searchFormRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search here..."
            ref={searchInputRef}
            onKeyDown={handleKeyDown}
            required
          />
          <button type="button" className="search-button" onClick={handleToggle}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button>
        </form>
      </div>

      {/* News Cards */}
      <div className="container" style={{ marginTop: "10px" }}>
        {newsData.map((news, index) => (
          <div className="card" key={index}>
            <div className="card__header">
              <img src={news.image} alt="News" className="card__image" />
            </div>
            <div className="card__body">
              <span className={`tag ${getTagClass(news.tag)}`}>{news.tag}</span>
              <h4>{news.title}</h4>
              <p>{news.description}</p>
            </div>
            <div className="card__footer">
              <div className="user">
                <img src={news.userImage} alt="User" className="user__image" />
                <div className="user__info">
                  <h5>{news.author}</h5>
                  <small>{news.time}</small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingNews; 