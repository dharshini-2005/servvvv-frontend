import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/Bathroom.css";

const Bathroom = () => {
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
  const [cart, setCart] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userEmail) {
      setError("");
      setLoading(true);
      const endpoint = role === "provider"
        ? `https://servvvv.onrender.com/api/services/bathroom-services/provider/${encodeURIComponent(userEmail)}`
        : "https://servvvv.onrender.com/api/services/bathroom-services";
        
      fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (!Array.isArray(data)) {
            throw new Error('Invalid response format');
          }
          const servicesWithIds = data.map(service => ({
            ...service,
            _id: service._id || service.id
          }));
          setServices(servicesWithIds);
          if (servicesWithIds.length === 0 && role === "provider") {
            setError("No services found. Add your first service!");
          }
        })
        .catch(err => {
          setError(err.message || "Failed to load services. Please try again later.");
          setServices([]);
        })
        .finally(() => setLoading(false));
    }
  }, [userEmail, role]);

  const handleProviderChange = (e) => {
    setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
    setError("");
  };

  const submitProviderService = async () => {
    const { name, price, time, description } = providerInput;
    if (!name || !price || !time || !description) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newService = { 
        ...providerInput, 
        providerEmail: userEmail,
        price: Number(price)
      };

      const response = await fetch("https://servvvv.onrender.com/api/services/bathroom-services", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setServices(prev => [...prev, data]);
      setProviderInput({ name: "", price: "", time: "", description: "" });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service) => {
    if (!userEmail) {
      setError("Please login to add items to cart");
      return;
    }
    if (!service._id) {
      setError("Invalid service data");
      return;
    }
    setCart(prev => [...prev, service]);
    setError("");
  };

  const bookCartServices = async () => {
    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookings = cart.map(service => ({
        serviceId: service._id,
        customerEmail: userEmail,
      }));

      const response = await fetch("https://servvvv.onrender.com/api/bathroom-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookings }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      setCart([]);
      setError("");
      alert("Services booked successfully!");
    } catch (err) {
      setError(err.message || "Failed to book services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (email) => setUserEmail(email);

  const backgroundStyle = {
    backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgzsO2MSJ_AerKlK4CMJPP8yl39v57rNi6SsNBZ8J9THx3G3MH5brth1PmuwxrtEhQclI&usqp=CAU")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  return (
    <div className={`bathroom-page ${role ? "no-bg" : ""}`}>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      {!role && (
        <section className="hero" style={backgroundStyle}>
          <div className="hero-content">
            <h1>Bathroom Services</h1>
            <p>Reliable and professional bathroom repairs and cleaning.</p>
            <div className="role-buttons">
              <button onClick={() => setRole("provider")}>I'm a Provider</button>
              <button onClick={() => setRole("customer")}>I'm a Customer</button>
            </div>
          </div>
        </section>
      )}

      {role === "provider" && !userEmail && <ProviderLogin onLogin={handleLogin} />}
      {role === "customer" && !userEmail && <CustomerLogin onLogin={handleLogin} />}

      {role === "provider" && userEmail && (
        <div className="provider-form-section">
          <h2>{editingService ? "Edit Service" : "Add Your Bathroom Service"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Service Name or Company"
            value={providerInput.name}
            onChange={handleProviderChange}
            disabled={loading}
          />
          <input
            type="text"
            name="price"
            placeholder="Price (₹)"
            value={providerInput.price}
            onChange={handleProviderChange}
            disabled={loading}
          />
          <input
            type="text"
            name="time"
            placeholder="Time Required (e.g., 2 hours)"
            value={providerInput.time}
            onChange={handleProviderChange}
            disabled={loading}
          />
          <textarea
            name="description"
            placeholder="Service Description"
            value={providerInput.description}
            onChange={handleProviderChange}
            disabled={loading}
          />
          <button 
            onClick={submitProviderService}
            disabled={loading}
          >
            {loading ? "Processing..." : editingService ? "Update" : "Add Service"}
          </button>
        </div>
      )}

      {role === "customer" && userEmail && (
        <div className="customer-section">
          <h3>Welcome, {userEmail}</h3>
          <h2 className="avail">Available Services</h2>
          <div className="service-cards">
            {services.map((service) => {
              const serviceId = service._id || service.id;
              return (
                <div key={serviceId} className="service-card">
                  <h3>{service.name}</h3>
                  <p><strong>Price:</strong> ₹{service.price}</p>
                  <p><strong>Time:</strong> {service.time}</p>
                  <p>{service.description}</p>
                  <button 
                    onClick={() => addToCart(service)}
                    disabled={loading}
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              );
            })}
          </div>

          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Your Cart ({cart.length} items)</h3>
              {cart.map((item, index) => (
                <p key={`${item._id}-${index}`}>{item.name} - ₹{item.price}</p>
              ))}
              <button 
                className="book-btn"
                onClick={bookCartServices}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book All"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bathroom;
