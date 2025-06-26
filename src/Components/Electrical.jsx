import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/HomeCleaning.css";
import { useAuth } from "../context/AuthContext";

const BASE_URL = "https://servvvv.onrender.com";

const Electrical = () => {
  const [role, setRole] = useState("");
  const { user, setUser } = useAuth();
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
  const [cart, setCart] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user?.email && role) {
      setError("");
      setLoading(true);
      const endpoint = role === "provider"
        ? `${BASE_URL}/api/electrical-services/provider/${encodeURIComponent(user.email)}`
        : `${BASE_URL}/api/electrical-services`;

      fetch(endpoint)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch services');
          }
          return res.json();
        })
        .then(data => {
          setServices(data);
          if (data.length === 0 && role === "provider") {
            setError("No services found. Add your first service!");
          }
        })
        .catch(err => {
          setError("Failed to load services. Please try again later.");
        })
        .finally(() => setLoading(false));
    } else if (user && !role) {
      setLoading(false);
    } else if (!user) {
      setServices([]);
      setCart([]);
      setLoading(false);
      setRole("");
    }
  }, [user, role]);

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

    if (!user || user.role !== "provider") {
      setError("You must be logged in as a provider to add services.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newService = { ...providerInput, providerEmail: user.email };
      const response = await fetch(`${BASE_URL}/api/electrical-services`, {
        method: editingService ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (editingService) {
        setServices(prev => prev.map(service =>
          service._id === editingService._id ? data : service
        ));
        setEditingService(null);
        setSuccessMessage("Service updated successfully!");
      } else {
        setServices(prev => [...prev, data]);
        setSuccessMessage("Service added successfully!");
      }

      setProviderInput({ name: "", price: "", time: "", description: "" });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save service. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setProviderInput({
      name: service.name,
      price: service.price,
      time: service.time,
      description: service.description,
    });
    setError("");
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    if (!user || user.role !== "provider") {
      setError("You must be logged in as a provider to delete services.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/electrical-services/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete service");
      }

      setServices(prev => prev.filter(service => service._id !== serviceId));
      setSuccessMessage("Service deleted successfully!");
    } catch {
      setError("Failed to delete service. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const addToCart = (service) => {
    if (!user || user.role !== "customer") {
      setError("You must be logged in as a customer to add items to cart");
      return;
    }
    setCart(prev => [...prev, service]);
    setSuccessMessage("Service added to cart!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const removeFromCart = (serviceId) => {
    if (!user || user.role !== "customer") {
      setError("You must be logged in as a customer to remove items from cart.");
      return;
    }
    setCart(prev => prev.filter(item => item._id !== serviceId));
  };

  const bookService = async () => {
    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }

    if (!user || user.role !== "customer") {
      setError("You must be logged in as a customer to book services.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = cart.map((service) => ({
        serviceId: service._id,
        customerEmail: user.email,
      }));

      const response = await fetch(`${BASE_URL}/api/electrical-bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookings: bookingData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setCart([]);
      setSuccessMessage("Services booked successfully!");
    } catch {
      setError("Failed to book services. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleLogin = (userData) => {
    if (userData && userData.email && userData.role) {
      setUser(userData);
      setRole(userData.role);
      setError("");
    } else {
      setError("Login failed. Invalid user data.");
    }
  };

  const handleRegister = (userData) => {
    if (userData && userData.email && userData.role) {
      setUser(userData);
      setRole(userData.role);
      setError("");
    } else {
      setError("Registration failed. Invalid user data.");
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://media.istockphoto.com/id/1345962789/photo/electrician-engineer-uses-a-multimeter-to-test-the-electrical-installation-and-power-line.jpg?s=612x612&w=0&k=20&c=JZg0nF2yW9Kc-XCNNzYWXKQ8zRUsfO7t0WAZIiS3cbk=")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  return (
    <div className={`homecleaning-page ${role ? "no-bg" : ""}`}>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {loading && !role && <div className="loading-message">Loading...</div>}

      {!role && (
        <section className="hero" style={backgroundStyle}>
          <div className="hero-content">
            <h1>Electrical Services</h1>
            <p>Expert electrical repairs and installations for your home.</p>
            <div className="role-buttons">
              <button onClick={() => setRole("provider")}>I'm a Service Provider</button>
              <button onClick={() => setRole("customer")}>I'm a Customer</button>
            </div>
          </div>
        </section>
      )}

      {role && !user && (
        <div className="auth-section">
          {role === "provider" ? (
            <ProviderLogin onLogin={handleLogin} onRegister={handleRegister} />
          ) : (
            <CustomerLogin onLogin={handleLogin} onRegister={handleRegister} />
          )}
        </div>
      )}

      {role === "provider" && user && (
        <div className="provider-form-section">
          <h2>{editingService ? "Edit Service" : "Add Your Electrical Service"}</h2>
          <input type="text" name="name" placeholder="Service Name or Company" value={providerInput.name} onChange={handleProviderChange} disabled={loading} />
          <input type="number" name="price" placeholder="Price (₹)" value={providerInput.price} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="time" placeholder="Time Required (e.g., 2 hours)" value={providerInput.time} onChange={handleProviderChange} disabled={loading} />
          <textarea name="description" placeholder="Service Description" value={providerInput.description} onChange={handleProviderChange} disabled={loading} />
          <button onClick={submitProviderService} disabled={loading}>
            {loading ? "Processing..." : editingService ? "Update" : "Add Service"}
          </button>
          {editingService && (
            <button onClick={() => {
              setEditingService(null);
              setProviderInput({ name: "", price: "", time: "", description: "" });
            }} className="cancel-button" disabled={loading}>
              Cancel Edit
            </button>
          )}
          {services.length > 0 && (
            <div className="provider-services">
              <h3>Your Services</h3>
              <div className="service-cards">
                {services.map((service) => (
                  <div key={service._id} className="service-card">
                    <h3>{service.name}</h3>
                    <p><strong>Price:</strong> ₹{service.price}</p>
                    <p><strong>Time:</strong> {service.time}</p>
                    <p>{service.description}</p>
                    <div className="service-actions">
                      <button onClick={() => handleEdit(service)} disabled={loading}>✏️ Edit</button>
                      <button onClick={() => handleDelete(service._id)} disabled={loading}>🗑️ Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {role === "customer" && user && (
        <div className="customer-section">
          <h3>Welcome, {user.email}</h3>
          <h2 className="avail">Available Services</h2>
          <div className="service-cards">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p><strong>Price:</strong> ₹{service.price}</p>
                <p><strong>Time:</strong> {service.time}</p>
                <p>{service.description}</p>
                <button onClick={() => addToCart(service)} disabled={loading || cart.some(item => item._id === service._id)}>
                  {cart.some(item => item._id === service._id) ? "Added to Cart ✓" : "🛒 Add to Cart"}
                </button>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Your Cart ({cart.length} items)</h3>
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <p>{item.name} - ₹{item.price}</p>
                  <button onClick={() => removeFromCart(item._id)} className="remove-from-cart" disabled={loading}>✕</button>
                </div>
              ))}
              <button className="book-btn" onClick={bookService} disabled={loading}>
                {loading ? "Booking..." : "Book All Services"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Electrical;
