import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "boxicons/css/boxicons.min.css"; // Icon library
import "../Styles/Navbar.css"; // Your custom CSS
import ContactModal from "./ContactModal";

const categories = {
  "Cleaning & Pest Control": [
    { name: "Full Home Cleaning", route: "/fullhome-cleaning" },
    { name: "Sofa & Carpet Cleaning", route: "/sofa-carpet-cleaning" },
    { name: "Cockroach, Ant & General Pest Control", route: "/cockroach-ant-pest-control" },
    { name: "Bathroom Cleaning", route: "/bathroom-cleaning" },
  ],
  "Appliance Service & Repair": [
    { name: "AC Service & Repair", route: "/ac-service" },
    { name: "Washing Machine", route: "/washing-machine" },
    { name: "Television", route: "/television" },
    { name: "Geyser", route: "/geyser" },
  ],
  "Quick Home Repairs": [
    { name: "Plumbing", route: "/plumbing" },
    { name: "Carpentry", route: "/carpentry" },
    { name: "Electrical", route: "/electrical" },
    { name: "Painting", route: "/painting" },
  ],
};

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    console.log("Searching for:", searchQuery);
  };

  const handleServiceClick = (route) => {
    setShowServices(false);
    navigate(route);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">ServEase</Link>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <button type="button">
              <i className="bx bx-search"></i>
            </button>
          </div>

          <div className="navbar-links">
            <Link to="/">Home</Link>
            <div
              className="services-dropdown-wrapper"
              onMouseEnter={() => setShowServices(true)}
              onMouseLeave={() => setShowServices(false)}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <button
                className="services-dropdown-btn"
                style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', font: 'inherit', padding: 0 }}
                onClick={() => setShowServices((prev) => !prev)}
                type="button"
              >
                Services <i className="bx bx-chevron-down"></i>
              </button>
              {showServices && (
                <div className="services-dropdown-menu">
                  {Object.keys(categories).map((cat) => (
                    <div key={cat} className="dropdown-category">
                      <div className="dropdown-category-title">{cat}</div>
                      {categories[cat].map((service, idx) => (
                        <div
                          key={service.name}
                          className="dropdown-service-item"
                          onClick={() => handleServiceClick(service.route)}
                        >
                          {service.name}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Link to="/about">About</Link>
            <button className="contact-link-btn" onClick={() => setShowContact(true)} style={{background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', font: 'inherit', padding: 0}}>Contact</button>
          </div>
        </div>
      </nav>
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
};

export default Navbar;