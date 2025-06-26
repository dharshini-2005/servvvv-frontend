import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/Carpentry.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Carpentry = () => {
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
          ? `https://servvvv.onrender.com/api/services/carpentry/provider/${encodeURIComponent(user.email)}`
          : "https://servvvv.onrender.com/api/services/carpentry";
        
        console.log('Fetching services from:', endpoint);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error('Received non-array data:', data);
          setServices([]);
          return;
        }
        
        const servicesWithIds = data.map(service => ({
          ...service,
          _id: service._id || service.id
        }));
        
        console.log('Fetched services:', servicesWithIds);
        setServices(servicesWithIds);
        
        if (servicesWithIds.length === 0 && role === "provider") {
          setError("No services found. Add your first service!");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
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
    setError(""); // Clear any previous errors
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
      console.log('Submitting service:', newService);

      const endpoint = editingService 
        ? `https://servvvv.onrender.com/api/services/carpentry/${editingService._id}`
        : "https://servvvv.onrender.com/api/services/carpentry";

      const method = editingService ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method: method,
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

      console.log('Service saved:', data);
      
      if (editingService) {
        setServices(prev => prev.map(service => 
          service._id === editingService._id ? data : service
        ));
        setEditingService(null);
        setSuccessMessage("Service updated successfully!");
        toast.success("Service updated successfully!");
      } else {
        const addedServiceWithId = { ...data, _id: data._id || data.id };
        setServices(prev => [...prev, addedServiceWithId]);
        setSuccessMessage("Service added successfully!");
        toast.success("Service added successfully!");
      }
      
      setProviderInput({ name: "", price: "", time: "", description: "" });
      setError("");
    } catch (err) {
      console.error("Error adding/updating service:", err);
      setError(err.message || "Failed to save service. Please try again.");
      toast.error(err.message || "Failed to save service");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const addToCart = (service) => {
    if (!user?.email) {
      setError("Please login to add items to cart");
      toast.error("Please login to add items to cart");
      return;
    }
    if (!service._id) {
      console.error('Service missing ID:', service);
      setError("Invalid service data");
      toast.error("Invalid service data");
      return;
    }
    setCart(prev => [...prev, service]);
    setError("");
    toast.success("Service added to cart!");
  };

  const removeFromCart = (serviceId) => {
    setCart(prev => prev.filter(item => item._id !== serviceId));
    toast.info("Service removed from cart");
  };

  const bookService = async () => {
    if (!cart.length) {
      setError("Your cart is empty");
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create booking data for all services in cart
      const bookingData = {
        bookings: cart.map(service => ({
          serviceId: service._id,
          customerEmail: user.email,
          status: "pending",
          bookingDate: new Date().toISOString()
        }))
      };

      console.log('Creating bookings with data:', bookingData);

      const response = await fetch("https://servvvv.onrender.com/api/bookings/carpentry", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      console.log('Booking response:', data);

      setCart([]);
      setError("");
      setSuccessMessage("Services booked successfully!");
      toast.success("Services booked successfully!");
    } catch (err) {
      console.error("Error booking services:", err);
      setError(err.message || "Failed to book services. Please try again.");
      toast.error(err.message || "Failed to book services");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleLogin = (userData) => {
    if (userData && userData.email) {
      console.log('Setting user data:', userData);
      setUser({
        email: userData.email,
        role: userData.role || 'provider',
        name: userData.name || userData.email.split('@')[0]
      });
    } else {
      console.error('Invalid user data:', userData);
      setError("Invalid login data received");
      toast.error("Invalid login data received");
    }
  };

  const backgroundStyle = {
    backgroundImage: 'url("https://www.shutterstock.com/image-photo/set-carpenters-tools-on-wooden-600nw-1072306157.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  return (
    <div className={`carpentry-page ${role ? "no-bg" : ""}`}>
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      {!role && (
        <section className="hero" style={backgroundStyle}>
          <div className="hero-content">
            <h1>Carpentry Services</h1>
            <p>Professional carpentry services for your home and office.</p>
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
          <h2>{editingService ? "Edit Service" : "Add Your Carpentry Service"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Service Name (e.g., Furniture Repair, Installation)"
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
            {loading ? "Processing..." : editingService ? "Update Service" : "Add Service"}
          </button>

          {editingService && (
            <button 
              onClick={() => {
                setEditingService(null);
                setProviderInput({ name: "", price: "", time: "", description: "" });
              }}
              className="cancel-button"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}

          <div className="service-list">
            <h3>Your Services</h3>
            {services.map(service => (
              <div key={service._id} className="service-item">
                <h4>{service.name}</h4>
                <p>Price: ₹{service.price}</p>
                <p>Time: {service.time}</p>
                <p>{service.description}</p>
                <div className="service-actions">
                  <button onClick={() => handleEdit(service)}>Edit</button>
                  <button onClick={() => handleDelete(service._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "customer" && user && (
        <div className="customer-section">
          <h3>Welcome, {user.email}</h3>
          <h2 className="avail">Available Carpentry Services</h2>
          <div className="service-cards">
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <h3>{service.name}</h3>
                <p><strong>Price:</strong> ₹{service.price}</p>
                <p><strong>Time:</strong> {service.time}</p>
                <p>{service.description}</p>
                <button 
                  onClick={() => addToCart(service)}
                  disabled={loading || cart.some(item => item._id === service._id)}
                >
                  {cart.some(item => item._id === service._id) ? "Added to Cart ✓" : "🛒 Add to Cart"}
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Your Cart ({cart.length} items)</h3>
              {cart.map((item, index) => {
                const itemId = item._id || item.id;
                return (
                  <div key={`${itemId}-${index}`} className="cart-item">
                    <p>{item.name} - ₹{item.price}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="remove-from-cart"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              <button 
                className="book-btn"
                onClick={bookService}
                disabled={loading}
              >
                {loading ? "Booking..." : "Book All Services"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Carpentry;
