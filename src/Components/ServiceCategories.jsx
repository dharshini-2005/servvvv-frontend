import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ServiceCategories.css";

const categories = {
  "Cleaning & Pest Control": [
    {
      name: "Full Home Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop",
      route: "/fullhome-cleaning",
    },
    {
      name: "Sofa & Carpet Cleaning",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
      route: "/sofa-carpet-cleaning",
    },
    {
      name: "Cockroach, Ant & Pest Control",
      image: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&auto=format&fit=crop",
      route: "/cockroach-ant-pest-control",
    },
    {
      name: "Bathroom Cleaning",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&auto=format&fit=crop",
      route: "/bathroom-cleaning",
    },
  ],
  "Appliance Service & Repair": [
    {
      name: "AC Service & Repair",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop",
      route: "/ac-service",
    },
    {
      name: "Washing Machine",
      image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop",
      route: "/washing-machine",
    },
    {
      name: "Television",
      image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&auto=format&fit=crop",
      route: "/television",
    },
    {
      name: "Geyser Repair",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop",
      route: "/geyser",
    },
  ],
  "Quick Home Repairs": [
    {
      name: "Plumbing",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop",
      route: "/plumbing",
    },
    {
      name: "Carpentry",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop",
      route: "/carpentry",
    },
    {
      name: "Electrical",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop",
      route: "/electrical",
    },
    {
      name: "Painting",
      image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&auto=format&fit=crop",
      route: "/painting",
    },
  ],
};

const VISIBLE = 3;

const ServiceCategories = () => {
  const [startIndices, setStartIndices] = useState(
    Object.keys(categories).reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {})
  );
  const navigate = useNavigate();

  const handlePrev = (cat) =>
    setStartIndices((prev) => ({ ...prev, [cat]: Math.max(prev[cat] - 1, 0) }));

  const handleNext = (cat) =>
    setStartIndices((prev) => ({
      ...prev,
      [cat]: Math.min(prev[cat] + 1, categories[cat].length - VISIBLE),
    }));

  return (
    <section className="service-container">
      <div className="service-section-inner">
        {/* Header */}
        <div className="service-header">
          <div className="service-header-tag">
            🛠️ Our Services
          </div>
          <h2 className="service-title">What are you looking for?</h2>
          <p className="service-subtitle">
            Professional home services delivered by verified experts — book in minutes.
          </p>
        </div>

        {/* Categories */}
        {Object.entries(categories).map(([cat, services]) => (
          <div key={cat} className="category-section">
            <div className="category-header">
              <h3 className="category-title">{cat}</h3>
              <div className="category-line" />
            </div>

            <div className="button-container">
              <button
                className="nav-button"
                onClick={() => handlePrev(cat)}
                disabled={startIndices[cat] === 0}
                aria-label="Previous"
              >
                ‹
              </button>

              <div className="button-group">
                {services
                  .slice(startIndices[cat], startIndices[cat] + VISIBLE)
                  .map((service) => (
                    <button
                      key={service.route}
                      className="service-button"
                      onClick={() => navigate(service.route)}
                      aria-label={`Book ${service.name}`}
                    >
                      <div className="service-image-wrap">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="service-image"
                          loading="lazy"
                        />
                        <div className="service-image-overlay" />
                      </div>
                      <span className="service-button-label">{service.name}</span>
                    </button>
                  ))}
              </div>

              <button
                className="nav-button"
                onClick={() => handleNext(cat)}
                disabled={startIndices[cat] >= services.length - VISIBLE}
                aria-label="Next"
              >
                ›
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;
