import React, { useState } from "react";

const ServiceProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", amount: "", time: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddService = () => {
    if (form.name && form.amount && form.time) {
      setServices([...services, form]);
      setForm({ name: "", amount: "", time: "" });
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="dashboard">
      <h2>Service Provider Dashboard</h2>
      <div className="add-service-form">
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (in ₹)"
          value={form.amount}
          onChange={handleChange}
        />
        <input
          type="text"
          name="time"
          placeholder="Estimated Time"
          value={form.time}
          onChange={handleChange}
        />
        <button onClick={handleAddService}>Add Service</button>
      </div>
      <h3>My Services</h3>
      <ul>
        {services.map((s, i) => (
          <li key={i}>{s.name} - ₹{s.amount} - {s.time}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceProviderDashboard;
