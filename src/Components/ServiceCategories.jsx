import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/ServiceCategories.css";

const categories = {
  "Cleaning & Pest Control": [
    {
      name: "Full Home Cleaning",
      image: "https://www.houseoffixes.com/img/subcategory/deep-clean-service.webp",
      route: "/fullhome-cleaning",
    },
    {
      name: "Sofa & Carpet Cleaning",
      image: "https://www.homecaresolutions.in/assets/images/choose/sofa.jpg",
      route: "/sofa-carpet-cleaning",
    },
    {
      name: "Cockroach, Ant & General Pest Control",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI7VAwE8_4VnC1jup5EwkH_pp1a63LNZktqQ&s",
      route: "/cockroach-ant-pest-control",
    },
    {
      name: "Bathroom Cleaning",
      image: "https://t4.ftcdn.net/jpg/03/20/28/73/360_F_320287361_Cq6lb6COc1Wwd7gF1jUoGCz3Waq5mO8o.jpg",
      route: "/bathroom-cleaning",  // Update the route
    },
  ],
  "Appliance Service & Repair": [
    {
      name: "AC Service & Repair",
      image: "https://www.shutterstock.com/image-photo/hvac-technician-performing-air-conditioner-600nw-2488702851.jpg",
      route: "/ac-service",
    },
    {
      name: "Washing Machine",
      image: "https://www.guptahomeappliances.in/wp-content/uploads/2023/03/washing-machine-service-Copy.webp",
      route: "/washing-machine",  // Route for Washing Machine
    },
    {
      name: "Television",
      image: "https://repairguru.in/wp-content/uploads/2022/06/3940852.jpeg",
      route: "/television",
    },
    {
      name: "Geyser",
      image: "https://www.gooezy.com/uiassets/images/geyser-repair.webp",
      route: "/geyser",  // Add route for Geyser if needed
    },
  ],
  "Quick Home Repairs": [
    {
      name: "Plumbing",
      image: "https://t3.ftcdn.net/jpg/04/80/48/10/360_F_480481061_rld9llq95TvFSMM3vAcacadXeVtiAYa6.jpg",
      route: "/plumbing",  // Add route for Plumbing if needed
    },
    {
      name: "Carpentry",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6m0p7gFuJihFkYabLFH7qFul6Cx0IGsut7Q&s",
      route: "/carpentry",  // Add route for Carpentry if needed
    },
    {
      name: "Electrical",
      image: "https://mtcopeland.com/wp-content/uploads/2022/01/shutterstock_1815897341-min-scaled.jpg",
      route: "/electrical",  // Add route for Electrical if needed
    },
    {
      name: "Painting",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1V_0CuH3fyDkgx3bJDE3XvK5WE30a3qMqfA&s",
      route: "/painting",  // Add route for Painting if needed
    },
  ],
};

const ServiceCategories = () => {
  const [startIndices, setStartIndices] = useState(
    Object.keys(categories).reduce((acc, category) => ({ ...acc, [category]: 0 }), {})
  );
  const visibleCount = 3;
  const navigate = useNavigate();

  const handlePrev = (category) => {
    setStartIndices((prev) => ({
      ...prev,
      [category]: Math.max(prev[category] - 1, 0),
    }));
  };

  const handleNext = (category) => {
    setStartIndices((prev) => ({
      ...prev,
      [category]: Math.min(prev[category] + 1, categories[category].length - visibleCount),
    }));
  };

  const handleClick = (service) => {
    if (service.route) {
      navigate(service.route);
    }
  };

  return (
    <div className="service-container">
      <h3 className="service-title">What are you looking for?</h3>

      {Object.keys(categories).map((category) => (
        <div key={category} className="category-section">
          <h4 className="category-title">{category}</h4>

          <div className="button-container">
            <button
              className="nav-button left"
              onClick={() => handlePrev(category)}
              disabled={startIndices[category] === 0}
            >
              &#9665;
            </button>

            <div className="button-group">
              {categories[category]
                .slice(startIndices[category], startIndices[category] + visibleCount)
                .map((service, index) => (
                  <button
                    key={index}
                    className="service-button"
                    onClick={() => handleClick(service)}
                  >
                    <img src={service.image} alt={service.name} className="service-image" />
                    <span>{service.name}</span>
                  </button>
                ))}
            </div>

            <button
              className="nav-button right"
              onClick={() => handleNext(category)}
              disabled={startIndices[category] >= categories[category].length - visibleCount}
            >
              &#9655;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCategories;
