import React from "react";
import "../Styles/Footer.css"; // Importing CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - Company Info */}
        <div className="footer-section">
          <h3>ServEase</h3>
          <p>Your trusted home service provider.</p>
        </div>

        {/* Middle Section - Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Right Section - Contact & Socials */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@servease.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 ServEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
