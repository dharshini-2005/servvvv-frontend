import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/HomeCleaning.css";

const SofaCarpet = () => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ 
    name: "", 
    price: "", 
    time: "", 
    description: "",
    type: "sofa"
  });
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
          ? `https://servvvv.onrender.com/api/services/sofa-carpet/provider/${encodeURIComponent(user.email)}`
          : "https://servvvv.onrender.com/api/services/sofa-carpet";

        console.log('Fetching services from:', endpoint);

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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
    const { name, price, time, description, type } = providerInput;
    if (!name || !price || !time || !description || !type) {
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
        price: Number(price)
      };
      console.log('Submitting service:', newService);

      const response = await fetch("https://servvvv.onrender.com/api/services/sofa-carpet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      setServices(prev => [...prev, data.service || data]);
      setProviderInput({ name: "", price: "", time: "", description: "", type: "sofa" });
      setError("");
      alert("Service added successfully!");
    } catch (err) {
      console.error("Error adding service:", err);
      setError(err.message || "Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service) => {
    if (!user?.email) {
      setError("Please login to add items to cart");
      return;
    }
    if (!service._id) {
      console.error('Service missing ID:', service);
      setError("Invalid service data");
      return;
    }
    console.log('Adding to cart:', {
      serviceId: service._id,
      name: service.name,
      price: service.price
    });
    setCart(prev => [...prev, service]);
    setError("");
  };

  const bookService = async () => {
    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Current cart items:', cart.map(item => ({
        id: item._id,
        name: item.name,
        price: item.price
      })));

      const bookingData = cart.map((service) => {
        if (!service._id) {
          throw new Error("Invalid service data in cart");
        }
        return {
          serviceId: service._id,
          customerEmail: user.email,
        };
      });

      console.log('Sending booking data:', bookingData);

      const response = await fetch("https://servvvv.onrender.com/api/bookings/sofa-carpet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookings: bookingData }),
      });

      const responseData = await response.json();
      console.log('Booking response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      setCart([]);
      setError("");
      alert("Services booked successfully!");
    } catch (err) {
      console.error("Error booking services:", err);
      setError(err.message || "Failed to book services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    if (userData && userData.email) {
      console.log('Setting user data:', userData);
      setUser(userData);
    } else {
      console.error('Invalid user data:', userData);
      setError("Invalid login data received");
    }
  };

  const backgroundStyle = {
    backgroundImage: `url("https://media.istockphoto.com/id/854410184/photo/woman-cleaning-sofa-with-vacuum-cleaner.jpg?s=612x612&w=0&k=20&c=mwkNlZcJuz2auht5iTBsOpO3xu1ZRO3yPHcuOFJQD4g=")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  return (
    <div className={`sofacarpet-page ${role ? "no-bg" : ""}`}>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      {!role && (
        <section className="hero" style={backgroundStyle}>
          <div className="hero-content">
            <h1>Sofa & Carpet Cleaning Services</h1>
            <p>Professional cleaning services for your furniture and carpets.</p>
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
          <h2>{editingService ? "Edit Service" : "Add Your Sofa/Carpet Cleaning Service"}</h2>
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
          <select
            name="type"
            value={providerInput.type}
            onChange={handleProviderChange}
            disabled={loading}
          >
            <option value="sofa">Sofa Cleaning</option>
            <option value="carpet">Carpet Cleaning</option>
          </select>
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

      {role === "customer" && user && (
        <div className="customer-section">
          <h3>Welcome, {user.email}</h3>
          <h2 className="avail">Available Services</h2>
          <div className="service-cards">
            {services.map((service) => {
              const serviceId = service._id || service.id;
              if (!serviceId) {
                console.error('Service missing ID:', service);
                return null;
              }
              return (
                <div key={serviceId} className="service-card">
                  <h3>{service.name}</h3>
                  <p><strong>Type:</strong> {service.type === 'sofa' ? 'Sofa Cleaning' : 'Carpet Cleaning'}</p>
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
              {cart.map((item, index) => {
                const itemId = item._id || item.id;
                return (
                  <p key={`${itemId}-${index}`}>
                    {item.name} ({item.type === 'sofa' ? 'Sofa' : 'Carpet'}) - ₹{item.price}
                  </p>
                );
              })}
              <button 
                className="book-btn"
                onClick={bookService}
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

export default SofaCarpet;
