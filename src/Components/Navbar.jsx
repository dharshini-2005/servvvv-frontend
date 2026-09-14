import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Navbar.css";
import ContactModal from "./ContactModal";

const categories = {
  "Cleaning & Pest Control": [
    { name: "Full Home Cleaning", route: "/fullhome-cleaning", icon: "🏠" },
    { name: "Sofa & Carpet Cleaning", route: "/sofa-carpet-cleaning", icon: "🛋️" },
    { name: "Cockroach, Ant & Pest Control", route: "/cockroach-ant-pest-control", icon: "🐜" },
    { name: "Bathroom Cleaning", route: "/bathroom-cleaning", icon: "🚿" },
  ],
  "Appliance Service & Repair": [
    { name: "AC Service & Repair", route: "/ac-service", icon: "❄️" },
    { name: "Washing Machine", route: "/washing-machine", icon: "🌀" },
    { name: "Television", route: "/television", icon: "📺" },
    { name: "Geyser", route: "/geyser", icon: "🔥" },
  ],
  "Quick Home Repairs": [
    { name: "Plumbing", route: "/plumbing", icon: "🔧" },
    { name: "Carpentry", route: "/carpentry", icon: "🪚" },
    { name: "Electrical", route: "/electrical", icon: "⚡" },
    { name: "Painting", route: "/painting", icon: "🎨" },
  ],
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // All services flat list for search
  const allServices = Object.values(categories).flat();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowServices(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearchDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setShowServices(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      const filtered = allServices.filter((s) =>
        s.name.toLowerCase().includes(q.toLowerCase())
      );
      setSearchResults(filtered);
      setShowSearchDrop(true);
    } else {
      setSearchResults([]);
      setShowSearchDrop(false);
    }
  };

  const handleSearchSelect = (route) => {
    setSearchQuery("");
    setShowSearchDrop(false);
    navigate(route);
  };

  const handleServiceClick = (route) => {
    setShowServices(false);
    setMenuOpen(false);
    navigate(route);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">⚡</span>
            Service<span className="logo-x">X</span>
          </Link>

          {/* Search */}
          <div className="navbar-search" ref={searchRef}>
            <span className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search for a service…"
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => searchQuery && setShowSearchDrop(true)}
            />
            {showSearchDrop && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((s) => (
                  <div
                    key={s.route}
                    className="search-result-item"
                    onMouseDown={() => handleSearchSelect(s.route)}
                  >
                    <span className="search-result-icon">{s.icon}</span>
                    {s.name}
                  </div>
                ))}
              </div>
            )}
            {showSearchDrop && searchResults.length === 0 && searchQuery && (
              <div className="search-dropdown">
                <div className="search-no-result">No services found</div>
              </div>
            )}
          </div>

          {/* Desktop Links */}
          <div className={`navbar-links${menuOpen ? " navbar-links--open" : ""}`}>
            <Link to="/" className={`nav-link${location.pathname === "/" ? " nav-link--active" : ""}`}>
              Home
            </Link>

            <div
              className="services-dropdown-wrapper"
              ref={dropdownRef}
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
            >
              <button
                className={`nav-link services-toggle${showServices ? " nav-link--active" : ""}`}
                onClick={() => setShowServices((p) => !p)}
                type="button"
              >
                Services
                <svg className={`chevron${showServices ? " chevron--open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showServices && (
                <div className="services-dropdown-menu">
                  {Object.entries(categories).map(([cat, services]) => (
                    <div key={cat} className="dropdown-category">
                      <div className="dropdown-category-title">{cat}</div>
                      {services.map((service) => (
                        <div
                          key={service.route}
                          className="dropdown-service-item"
                          onClick={() => handleServiceClick(service.route)}
                        >
                          <span className="dropdown-item-icon">{service.icon}</span>
                          {service.name}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/about" className={`nav-link${location.pathname === "/about" ? " nav-link--active" : ""}`}>
              About
            </Link>

            <button
              className="nav-link contact-btn-link"
              onClick={() => setShowContact(true)}
              type="button"
            >
              Contact
            </button>

            <Link to="/login" className="navbar-cta">
              Get Started
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " hamburger--open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle navigation menu"
            type="button"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
};

export default Navbar;
