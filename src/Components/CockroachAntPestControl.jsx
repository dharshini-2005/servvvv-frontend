import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/HomeCleaning.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CockroachAntPestControl = () => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "", serviceType: "", areaCoverage: "" });
  const [cart, setCart] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user?.email || !role) return;

      setError("");
      setLoading(true);
      
      try {
        const endpoint = role === "provider" 
          ? `https://servvvv.onrender.com/api/services/cockroach-ant-pest/provider/${encodeURIComponent(user.email)}`
          : "https://servvvv.onrender.com/api/services/cockroach-ant-pest";

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const servicesWithIds = data.map(service => ({
          ...service,
          _id: service._id || service.id
        }));

        setServices(servicesWithIds);

        if (servicesWithIds.length === 0 && role === "provider") {
          setError("No services found. Add your first service!");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user?.email, role]);

  const handleProviderChange = (e) => {
    setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
  };

  const submitProviderService = async () => {
    const { name, price, time, description, serviceType, areaCoverage } = providerInput;
    if (!name || !price || !time || !description || !serviceType || !areaCoverage) {
      setError("Please fill all fields");
      return;
    }

    if (!user?.email) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const newService = { 
        ...providerInput, 
        providerEmail: user.email,
        price: Number(price),
        serviceType,
        areaCoverage
      };

      const response = await fetch("https://servvvv.onrender.com/api/services/cockroach-ant-pest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      setServices(prev => [...prev, data.service || data]);
      setProviderInput({ name: "", price: "", time: "", description: "", serviceType: "", areaCoverage: "" });
      setError("");
      toast.success("Service added successfully!");
    } catch (err) {
      console.error("Error adding service:", err);
      setError(err.message || "Failed to add service. Please try again.");
      toast.error("Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service) => {
    if (!user?.email) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!service._id) {
      console.error('Service missing ID:', service);
      setError("Invalid service data");
      return;
    }
    setCart(prev => [...prev, service]);
    toast.success("Added to cart!");
  };

  const bookService = async () => {
    if (!cart.length) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        serviceId: cart[0]._id,
        customerEmail: user.email,
        providerEmail: cart[0].providerEmail,
        bookingDate: new Date().toISOString(),
        address: user.address || "Address to be provided",
        totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
        specialInstructions: "Multiple services booked"
      };

      const response = await fetch("https://servvvv.onrender.com/api/bookings/cockroach-ant-pest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      setCart([]);
      setError("");
      toast.success("Services booked successfully!");
    } catch (err) {
      console.error("Error booking services:", err);
      setError(err.message || "Failed to book services. Please try again.");
      toast.error("Failed to book services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    if (userData && userData.email) {
      setUser(userData);
    } else {
      setError("Invalid login data received");
    }
  };

  const pestControlBackground = {
    backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/049/466/223/small_2x/cute-flying-fish-peeking-through-a-hole-free-photo.jpg")',
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      {!role && (
        <section className="hero" style={pestControlBackground}>
          <div className="hero-content">
            <h1>Pest Control Services</h1>
            <p>Expert solutions for Cockroaches, Ants, and other pests.</p>
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
          <h2>{editingService ? "Edit Service" : "Add Your Pest Control Service"}</h2>
          <input type="text" name="name" placeholder="Service Name or Company" value={providerInput.name} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="price" placeholder="Price (₹)" value={providerInput.price} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="time" placeholder="Time Required (e.g., 2 hours)" value={providerInput.time} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="serviceType" placeholder="Service Type (cockroach, ant, or general)" value={providerInput.serviceType || ""} onChange={handleProviderChange} disabled={loading} />
          <input type="text" name="areaCoverage" placeholder="Area Coverage (e.g., 1000 sq ft)" value={providerInput.areaCoverage || ""} onChange={handleProviderChange} disabled={loading} />
          <textarea name="description" placeholder="Service Description" value={providerInput.description} onChange={handleProviderChange} disabled={loading} />
          <button onClick={submitProviderService} disabled={loading}>{loading ? "Processing..." : editingService ? "Update" : "Add Service"}</button>

          <div className="service-list">
            <h3>Your Services</h3>
            {services.map((service) => (
              <div key={service._id} className="service-card">
                <h4>{service.name}</h4>
                <p><strong>Price:</strong> ₹{service.price}</p>
                <p><strong>Time:</strong> {service.time}</p>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {role === "customer" && user && (
        <div className="customer-section">
          <h3>Welcome, {user.email}</h3>
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
                  <button onClick={() => addToCart(service)} disabled={loading}>🛒 Add to Cart</button>
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
              <button className="book-btn" onClick={bookService} disabled={loading}>
                {loading ? "Booking..." : "Book All"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CockroachAntPestControl;
