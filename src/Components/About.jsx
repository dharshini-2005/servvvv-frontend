import React from 'react';
import '../Styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About ServEase</h1>
        <p className="about-subtitle">Transforming Home Services for a Better Tomorrow</p>
      </div>

      <div className="about-content">
        <section className="about-section vision-section">
          <div className="section-icon">👁️</div>
          <h2>Our Vision</h2>
          <p>
            To become the most trusted and innovative home services platform, revolutionizing how people access and experience 
            professional home services. We envision a world where quality home services are accessible, reliable, and seamless 
            for every household.
          </p>
        </section>

        <section className="about-section mission-section">
          <div className="section-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            To simplify and enhance the home service experience by connecting skilled professionals with homeowners through 
            a reliable, transparent, and user-friendly platform. We are committed to:
          </p>
          <ul>
            <li>Providing exceptional service quality and reliability</li>
            <li>Empowering service providers with growth opportunities</li>
            <li>Creating a seamless booking and service experience</li>
            <li>Building trust through transparency and accountability</li>
            <li>Making professional home services accessible to all</li>
          </ul>
        </section>

        <section className="about-section values-section">
          <div className="section-icon">💎</div>
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3>Excellence</h3>
              <p>Delivering the highest quality service in everything we do</p>
            </div>
            <div className="value-item">
              <h3>Integrity</h3>
              <p>Building trust through honest and transparent practices</p>
            </div>
            <div className="value-item">
              <h3>Innovation</h3>
              <p>Continuously improving and adapting to better serve our community</p>
            </div>
            <div className="value-item">
              <h3>Customer First</h3>
              <p>Putting our customers' needs at the heart of every decision</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
