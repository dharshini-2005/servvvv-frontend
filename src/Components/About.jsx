import React from "react";
import { Link } from "react-router-dom";
import "../Styles/About.css";

const stats = [
  { value: "12M+", label: "Services Booked" },
  { value: "50+",  label: "Cities Served" },
  { value: "4.8★", label: "Average Rating" },
  { value: "1M+",  label: "Happy Customers" },
];

const values = [
  { icon: "🏆", title: "Excellence",      text: "Delivering the highest quality in every service we facilitate." },
  { icon: "🤝", title: "Integrity",       text: "Building lasting trust through honest, transparent practices." },
  { icon: "💡", title: "Innovation",      text: "Continuously evolving our platform to better serve you." },
  { icon: "❤️", title: "Customer First", text: "Every decision starts and ends with our customers' needs." },
];

const About = () => (
  <div className="about-page">
    {/* Hero */}
    <div className="about-hero">
      <div className="about-hero-inner">
        <Link to="/" className="about-breadcrumb">
          ← Back to Home
        </Link>
        <h1>About ServiceX</h1>
        <p>
          India's fastest-growing home services platform — connecting verified professionals
          with millions of households every day.
        </p>
      </div>
    </div>

    {/* Stats bar */}
    <div className="about-stats">
      <div className="about-stats-inner">
        {stats.map((s) => (
          <div className="about-stat-item" key={s.label}>
            <span className="about-stat-value">{s.value}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Content */}
    <div className="about-content">
      {/* Vision */}
      <div className="about-section">
        <div className="section-icon-wrap">👁️</div>
        <h2>Our Vision</h2>
        <p>
          To become India's most trusted home services platform — where every household
          can access safe, reliable, and affordable professional help with a single tap.
          We envision a future where quality service is never more than minutes away.
        </p>
      </div>

      {/* Mission */}
      <div className="about-section">
        <div className="section-icon-wrap">🎯</div>
        <h2>Our Mission</h2>
        <p>
          ServiceX connects skilled professionals with homeowners through a transparent,
          easy-to-use platform. We are committed to:
        </p>
        <ul>
          <li>Providing exceptional, consistent service quality</li>
          <li>Empowering service providers with growth opportunities and fair earnings</li>
          <li>Making booking fast, seamless, and stress-free</li>
          <li>Building community trust through accountability and transparency</li>
          <li>Making professional home services accessible to every household</li>
        </ul>
      </div>

      {/* Values */}
      <div className="about-section">
        <div className="section-icon-wrap">💎</div>
        <h2>Our Core Values</h2>
        <div className="values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <div className="value-card-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to experience ServiceX?</h2>
        <p>Join over a million happy customers across India.</p>
        <Link to="/" className="about-cta-btn">Explore Services →</Link>
      </div>
    </div>
  </div>
);

export default About;
