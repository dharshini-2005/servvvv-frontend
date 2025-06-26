import React, { useState } from "react";

const CustomerDashboard = () => {
  const [services, setServices] = useState([
    { name: "Full Home Cleaning", amount: 1500, time: "2 hours" },
    { name: "Bathroom Cleaning", amount: 500, time: "1 hour" }
  ]);

  const handleBook = (service) => {
    alert(`You have booked ${service.name} for ₹${service.amount}. Payment done!`);
  };

  return (
    <div className="dashboard">
      <h2>Customer Dashboard</h2>
      <div className="service-list">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h4>{service.name}</h4>
            <p>Price: ₹{service.amount}</p>
            <p>Time: {service.time}</p>
            <button onClick={() => handleBook(service)}>Book & Pay</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
