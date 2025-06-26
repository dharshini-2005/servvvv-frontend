import React from "react";
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
      route: "/bathroom-cleaning",
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
      route: "/washing-machine",
    },
    {
      name: "Television",
      image: "https://repairguru.in/wp-content/uploads/2022/06/3940852.jpeg",
      route: "/television",
    },
    {
      name: "Geyser",
      image: "https://www.gooezy.com/uiassets/images/geyser-repair.webp",
      route: "/geyser",
    },
  ],
  "Quick Home Repairs": [
    {
      name: "Plumbing",
      image: "https://t3.ftcdn.net/jpg/04/80/48/10/360_F_480481061_rld9llq95TvFSMM3vAcacadXeVtiAYa6.jpg",
      route: "/plumbing",
    },
    {
      name: "Carpentry",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6m0p7gFuJihFkYabLFH7qFul6Cx0IGsut7Q&s",
      route: "/carpentry",
    },
    {
      name: "Electrical",
      image: "https://mtcopeland.com/wp-content/uploads/2022/01/shutterstock_1815897341-min-scaled.jpg",
      route: "/electrical",
    },
    {
      name: "Painting",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1V_0CuH3fyDkgx3bJDE3XvK5WE30a3qMqfA&s",
      route: "/painting",
    },
  ],
};

const Services = () => {
  return (
    <div className="service-container">
      <h2 className="service-title">Our Services</h2>
      {Object.keys(categories).map((category) => (
        <div key={category} className="category-section">
          <h4 className="category-title">{category}</h4>
          <div className="button-group">
            {categories[category].map((service, index) => (
              <div key={index} className="service-button service-list-item">
                <img src={service.image} alt={service.name} className="service-image" />
                <span>{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Services; 