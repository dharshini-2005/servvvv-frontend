import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/Painting.css";

const Painting = () => {
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
  const [bookings, setBookings] = useState([]);
  const [cart, setCart] = useState([]);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    setServices([
      { id: 1, name: "Interior Wall Painting", price: "3000", time: "2 days", description: "Professional wall painting with premium finish." },
      { id: 2, name: "Exterior Wall Painting", price: "5000", time: "3 days", description: "Durable painting for external surfaces." },
      { id: 3, name: "Furniture Painting", price: "2000", time: "1 day", description: "Spray painting for tables, chairs, and cabinets." },
    ]);
  }, []);

  const handleProviderChange = (e) => {
    setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
  };

  const submitProviderService = () => {
    const { name, price, time, description } = providerInput;
    if (!name || !price || !time || !description) {
      alert("Please fill all fields");
      return;
    }
    setServices([...services, { ...providerInput, id: Date.now() }]);
    setProviderInput({ name: "", price: "", time: "", description: "" });
    alert("Service added!");
  };

  const addToCart = (service) => {
    if (!userEmail) {
      alert("Please login before adding to cart.");
      return;
    }
    setCart([...cart, service]);
    alert("Added to cart!");
  };

  const bookCartServices = () => {
    if (!cart.length) return alert("Cart is empty");
    const newBookings = cart.map((item) => ({
      id: Date.now() + Math.random(),
      customer: userEmail,
      ...item,
    }));
    setBookings([...bookings, ...newBookings]);
    setCart([]);
    alert("Booking successful!");
  };

  const getProviderBookings = (providerName) => {
    return bookings.filter(b => b.name === providerName);
  };

  const paintingBackground = {
    backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVoSQmRdKP_NP795_HZBHSTKq3EQiFFRCcQ-fSt2VC6oJP3FjrXmJLg3_R1GSjOUOuA_w&usqp=CAU")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  const handleLogin = (email) => setUserEmail(email);

  return (
    <div className={`painting-page ${role ? "no-bg" : ""}`}>
      {!role && (
        <section className="hero" style={paintingBackground}>
          <div className="hero-content">
            <h1>Painting Services</h1>
            <p>Transform your space with professional painting services.</p>
            <div className="role-buttons">
              <button onClick={() => setRole("provider")}>I'm a Service Provider</button>
              <button onClick={() => setRole("customer")}>I'm a Customer</button>
            </div>
          </div>
        </section>
      )}

      {role === "provider" && !userEmail && <ProviderLogin onLogin={handleLogin} />}
      {role === "customer" && !userEmail && <CustomerLogin onLogin={handleLogin} />}

      {role === "provider" && userEmail && (
        <div className="provider-form-section">
          <h2 className="add">Add Your Painting Service</h2>
          <input type="text" name="name" placeholder="Service Name or Company" value={providerInput.name} onChange={handleProviderChange} />
          <input type="text" name="price" placeholder="Price (₹)" value={providerInput.price} onChange={handleProviderChange} />
          <input type="text" name="time" placeholder="Time Required" value={providerInput.time} onChange={handleProviderChange} />
          <textarea name="description" placeholder="Service Description" value={providerInput.description} onChange={handleProviderChange} />
          <button onClick={submitProviderService}>Add Service</button>

          <div className="booking-list">
            <h3>Customer Bookings</h3>
            {services.map((service) => {
              const customerList = getProviderBookings(service.name);
              return (
                customerList.length > 0 && (
                  <div key={service.id} className="booking-card">
                    <h4>{service.name}</h4>
                    {customerList.map((b) => (
                      <p key={b.id}><strong>Customer:</strong> {b.customer}</p>
                    ))}
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}

      {role === "customer" && userEmail && (
        <div className="customer-section">
          <h3>Welcome, {userEmail}</h3>

          <button className="booking-toggle-btn" onClick={() => setShowBookings(!showBookings)}>
            {showBookings ? "Hide Bookings" : "View My Bookings"}
          </button>

          {showBookings ? (
            bookings.length ? (
              <div className="booking-list">
                <h3>Your Bookings</h3>
                {bookings
                  .filter((b) => b.customer === userEmail)
                  .map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <p><strong>Service:</strong> {booking.name}</p>
                      <p><strong>Time:</strong> {booking.time}</p>
                      <p><strong>Price:</strong> ₹{booking.price}</p>
                      <p><strong>Description:</strong> {booking.description}</p>
                    </div>
                  ))}
              </div>
            ) : <p>No bookings found.</p>
          ) : (
            <>
              <h2 className="avail">Available Services</h2>
              <div className="service-cards">
                {services.map((service) => (
                  <div key={service.id} className="service-card">
                    <h3>{service.name}</h3>
                    <p><strong>Price:</strong> ₹{service.price}</p>
                    <p><strong>Time:</strong> {service.time}</p>
                    <p>{service.description}</p>
                    <button onClick={() => addToCart(service)}>🛒 Add to Cart</button>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="cart-section">
                  <h3>Your Cart</h3>
                  {cart.map((item, index) => (
                    <p key={index}>{item.name} - ₹{item.price}</p>
                  ))}
                  <button className="book-btn" onClick={bookCartServices}>Book All</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Painting;
