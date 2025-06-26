import React, { useState, useEffect } from "react";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/HomeCleaning.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WashingMachine = () => {
  const [role, setRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
  const [cart, setCart] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (userEmail) {
      setError("");
      setLoading(true);
      const endpoint = role === "provider"
        ? `https://servvvv.onrender.com/api/services/washing-machine/provider/${encodeURIComponent(userEmail)}`
        : "https://servvvv.onrender.com/api/services/washing-machine";

      console.log('Fetching from endpoint:', endpoint);
      fetch(endpoint)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Received data:', data);
          const servicesWithIds = data.map(service => ({
            ...service,
            _id: service._id || service.id,
            providerEmail: service.providerEmail || userEmail
          }));
          setServices(servicesWithIds);
          if (servicesWithIds.length === 0 && role === "provider") {
            setError("No services found. Add your first service!");
          } else if (servicesWithIds.length === 0 && role === "customer") {
            setError("No washing machine services available at the moment.");
          }
        })
        .catch(err => {
          console.error("Error fetching services:", err);
          setError(err.message || "Failed to load services. Please try again later.");
          toast.error(err.message || "Failed to load services");
        })
        .finally(() => setLoading(false));
    }
  }, [userEmail, role]);

  const handleProviderChange = (e) => {
    setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
  };

  const submitProviderService = async () => {
    const { name, price, time, description } = providerInput;
    if (!name || !price || !time || !description) {
      setError("Please fill all fields");
      toast.error("Please fill all fields");
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
      console.log('Submitting service:', newService);

      const response = await fetch("https://servvvv.onrender.com/api/services/washing-machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setServices(prev => [...prev, data.service]);
      setProviderInput({ name: "", price: "", time: "", description: "" });
      setError("");
      toast.success("Service added successfully!");
    } catch (err) {
      console.error("Error adding service:", err);
      setError(err.message || "Failed to add service. Please try again.");
      toast.error(err.message || "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (service) => {
    if (!userEmail) {
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

  const bookService = async () => {
    if (!cart.length) {
      setError("Your cart is empty");
      toast.error("Your cart is empty");
      return;
    }

    if (!address.trim()) {
      setError("Please provide your address");
      toast.error("Please provide your address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        serviceId: cart[0]._id,
        customerEmail: userEmail,
        providerEmail: cart[0].providerEmail || userEmail,
        bookingDate: new Date().toISOString(),
        address: address.trim(),
        totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
        specialInstructions: cart.length > 1 ? "Multiple services booked" : ""
      };

      console.log('Sending booking data:', bookingData);

      const response = await fetch("https://servvvv.onrender.com/api/bookings/washing-machine", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log('Booking response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      setCart([]);
      setAddress("");
      setError("");
      toast.success("Services booked successfully!");
    } catch (err) {
      console.error("Error booking services:", err);
      setError(err.message || "Failed to book services. Please try again.");
      toast.error(err.message || "Failed to book services");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    if (userData && userData.email) {
      console.log('Setting user data:', userData);
      setUser(userData);
      setUserEmail(userData.email);
    } else {
      console.error('Invalid user data:', userData);
      setError("Invalid login data received");
    }
  };

  const washingMachineBackground = {
    backgroundImage: 'url("https://img.freepik.com/premium-photo/concept-washing-machine-washing-machine-with-open-drum-blue-background-3d-render_407474-4271.jpg")',
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
      <ToastContainer position="top-right" autoClose={3000} />
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}
      
      {!role && (
        <section className="hero" style={washingMachineBackground}>
          <div className="hero-content">
            <h1>Washing Machine Services</h1>
            <p>Expert washing machine repairs and maintenance for your home.</p>
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
          <h2>{editingService ? "Edit Service" : "Add Your Washing Machine Service"}</h2>
          <input
            type="text"
            name="name"
            placeholder="Service Name or Company"
            value={providerInput.name}
            onChange={handleProviderChange}
            disabled={loading}
          />
          <input
            type="number"
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
            {services.map((service) => (
              <div key={service._id} className="service-card">
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
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-section">
              <h3>Your Cart ({cart.length} items)</h3>
              {cart.map((item, index) => (
                <p key={`${item._id}-${index}`}>{item.name} - ₹{item.price}</p>
              ))}
              <div className="address-input">
                <input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={loading}
                />
              </div>
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

export default WashingMachine; 