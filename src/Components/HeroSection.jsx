import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "../Styles/HeroSection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&auto=format&fit=crop",
    alt: "Professional home cleaning service",
  },
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&auto=format&fit=crop",
    alt: "AC repair technician at work",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&auto=format&fit=crop",
    alt: "Plumbing repair service",
  },
  {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&auto=format&fit=crop",
    alt: "Electrical repair service",
  },
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&auto=format&fit=crop",
    alt: "Carpentry service",
  },
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3500,
  arrows: true,
  pauseOnHover: true,
};

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-inner">
        {/* ---- Left: Text ---- */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Trusted by 12M+ customers
          </div>

          <h1 className="hero-heading">
            Home services,<br />
            <span className="accent">at your doorstep</span>
          </h1>

          <p className="hero-sub">
            Book verified professionals for cleaning, repairs, appliance service
            and more — fast, reliable, and affordable.
          </p>

          <div className="hero-cta-group">
            <Link to="/fullhome-cleaning" className="hero-btn-primary">
              Book a Service
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/about" className="hero-btn-secondary">
              Learn More
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">4.8★</span>
              <span className="hero-stat-label">Service Rating</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">12M+</span>
              <span className="hero-stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">Cities Served</span>
            </div>
          </div>
        </div>

        {/* ---- Right: Slider ---- */}
        <div className="hero-image-wrapper">
          {/* Floating rating pill */}
          <div className="hero-rating-pill">
            ⭐ 4.8 / 5.0
          </div>

          <div className="hero-slider-frame">
            <Slider {...sliderSettings}>
              {slides.map((slide, i) => (
                <div key={i}>
                  <img src={slide.src} alt={slide.alt} />
                </div>
              ))}
            </Slider>
          </div>

          {/* Floating trust badge */}
          <div className="hero-trust-badge">
            <span className="hero-trust-icon">✅</span>
            <div className="hero-trust-text">
              <span className="hero-trust-title">Verified Professionals</span>
              <span className="hero-trust-subtitle">Background checked &amp; trained</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
