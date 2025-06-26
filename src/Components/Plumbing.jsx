import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/HomeCleaning.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Plumbing = () => {
  const BASE_URL = "https://servvvv.onrender.com";

  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
  const [cart, setCart] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      if (!user?.email || !role) return;

      setError("");
      setLoading(true);

      try {
        const endpoint = role === "provider"
          ? `${BASE_URL}/api/services/plumbing/provider/${encodeURIComponent(user.email)}`
          : `${BASE_URL}/api/services/plumbing`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) return setServices([]);

        const servicesWithIds = data.map(service => ({ ...service, _id: service._id || service.id }));
        setServices(servicesWithIds);

        if (!servicesWithIds.length && role === "provider") setError("No services found. Add your first service!");
      } catch (err) {
        setError("Failed to load services. Please try again later.");
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, role]);

  const handleProviderChange = (e) => {
    setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
    setError("");
  };

  const submitProviderService = async () => {
    const { name, price, time, description } = providerInput;
    if (!name || !price || !time || !description) {
      setError("Please fill all fields");
      toast.warn("Please fill all fields");
      return;
    }

    if (!user?.email) {
      setError("Please login first");
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newService = {
        name,
        price: price.toString(),
        time,
        description,
        providerEmail: user.email.toString()
      };

      const endpoint = editingService
        ? `${BASE_URL}/api/services/plumbing/${editingService._id}`
        : `${BASE_URL}/api/services/plumbing`;

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(newService)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);

      if (editingService) {
        setServices(prev => prev.map(service => service._id === editingService._id ? data : service));
        setEditingService(null);
        toast.success("Service updated successfully!");
      } else {
        setServices(prev => [...prev, { ...data, _id: data._id || data.id }]);
        toast.success("Service added successfully!");
      }

      setProviderInput({ name: "", price: "", time: "", description: "" });
      setSuccessMessage(editingService ? "Service updated" : "Service added");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const addToCart = (service) => {
    if (!user?.email) return toast.error("Please login to add items to cart");
    setCart(prev => [...prev, service]);
    toast.success("Service added to cart!");
  };

  const removeFromCart = (serviceId) => {
    setCart(prev => prev.filter(item => item._id !== serviceId));
    toast.info("Service removed from cart");
  };

  const bookService = async () => {
    if (!cart.length) return toast.error("Your cart is empty");
    setLoading(true);

    try {
      const bookingData = {
        bookings: cart.map(service => ({
          serviceId: service._id,
          customerEmail: user.email,
          status: "pending",
          bookingDate: new Date().toISOString()
        }))
      };

      const response = await fetch(`${BASE_URL}/api/bookings/plumbing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);

      setCart([]);
      toast.success("Services booked successfully!");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    if (userData?.email) {
      setUser({
        email: userData.email,
        role: userData.role || 'provider',
        name: userData.name || userData.email.split('@')[0]
      });
    } else {
      setError("Invalid login data received");
      toast.error("Invalid login data received");
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbEoJFON_RsJqcY05oSz8kocRm-hq9KnRpvg&s")',
    backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
  };

  return (
    <div className={`homecleaning-page ${role ? "no-bg" : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      {!role && (
        <section className="hero" style={backgroundStyle}>
          <div className="hero-content">
            <h1>Plumbing Services</h1>
            <p>Expert plumbing repairs and installations for your home.</p>
            <div className="role-buttons">
              <button onClick={() => setRole("provider")}>I'm a Service Provider</button>
              <button onClick={() => setRole("customer")}>I'm a Customer</button>
            </div>
          </div>
        </section>
      )}

      {role === "provider" && !user && <ProviderLogin onLogin={handleLogin} />}
      {role === "customer" && !user && <CustomerLogin onLogin={handleLogin} />}

      {role === "provider" && user && (
        <div className="provider-form-section">
          <h2>{editingService ? "Edit Service" : "Add Your Plumbing Service"}</h2>
          <input type="text" name="name" placeholder="Service Name" value={providerInput.name} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="price" placeholder="Price (₹)" value={providerInput.price} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="time" placeholder="Time Required" value={providerInput.time} onChange={handleProviderChange} disabled={loading} />
          <textarea name="description" placeholder="Service Description" value={providerInput.description} onChange={handleProviderChange} disabled={loading} />
          <button onClick={submitProviderService} disabled={loading}>{loading ? "Processing..." : editingService ? "Update" : "Add Service"}</button>

          <div className="service-list">
            <h3>Your Services</h3>
            {services.map(service => (
              <div key={service._id} className="service-item">
                <h4>{service.name}</h4>
                <p>Price: ₹{service.price}</p>
                <p>Time: {service.time}</p>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "customer" && user && (
        <div className="customer-section">
          <h3>Welcome, {user.email}</h3>
          <h2 className="avail">Available Plumbing Services</h2>
          <div className="service-cards">
            {services.map(service => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p><strong>Price:</strong> ₹{service.price}</p>
                <p><strong>Time:</strong> {service.time}</p>
                <p>{service.description}</p>
                <button onClick={() => addToCart(service)} disabled={loading || cart.some(item => item._id === service._id)}>
                  {cart.some(item => item._id === service._id) ? "Added ✓" : "🛒 Add to Cart"}
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Your Cart ({cart.length} items)</h3>
              {cart.map((item, index) => (
                <div key={`${item._id}-${index}`} className="cart-item">
                  <p>{item.name} - ₹{item.price}</p>
                  <button onClick={() => removeFromCart(item._id)} disabled={loading}>✕</button>
                </div>
              ))}
              <button className="book-btn" onClick={bookService} disabled={loading}>{loading ? "Booking..." : "Book All Services"}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Plumbing;
