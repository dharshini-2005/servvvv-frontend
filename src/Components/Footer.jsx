import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Footer.css";

const serviceLinks = [
  { name: "Full Home Cleaning", route: "/fullhome-cleaning" },
  { name: "AC Service & Repair", route: "/ac-service" },
  { name: "Plumbing", route: "/plumbing" },
  { name: "Electrical", route: "/electrical" },
  { name: "Pest Control", route: "/cockroach-ant-pest-control" },
  { name: "Carpentry", route: "/carpentry" },
];

const companyLinks = [
  { name: "About Us", route: "/about" },
  { name: "How It Works", route: "/" },
  { name: "For Providers", route: "/login" },
  { name: "Privacy Policy", route: "/" },
  { name: "Terms of Service", route: "/" },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            ⚡ Service<span className="footer-logo-x">X</span>
          </Link>
          <p>
            Your trusted home services platform. Connecting skilled professionals
            with households across India — fast, reliable, and affordable.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter / X">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            {serviceLinks.map((s) => (
              <li key={s.route}>
                <span onClick={() => navigate(s.route)}>{s.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {companyLinks.map((c) => (
              <li key={c.name}>
                <span onClick={() => navigate(c.route)}>{c.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📧</span>
            <span>support@servicex.in</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📞</span>
            <span>+91 98765 43210</span>
          </div>
          <div className="footer-contact-item">
            <span className="footer-contact-icon">📍</span>
            <span>Chennai, Tamil Nadu, India</span>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ServiceX. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
