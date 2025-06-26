// import React, { useState, useEffect } from "react";
// import ProviderLogin from "./ProviderLogin";
// import CustomerLogin from "./CustomerLogin";
// import "../Styles/HomeCleaning.css"; // Reusing HomeCleaning styles for now
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const Geyser = () => {
//   const [role, setRole] = useState("");
//   const [user, setUser] = useState(null);
//   const [services, setServices] = useState([]);
//   const [providerInput, setProviderInput] = useState({ name: "", price: "", time: "", description: "" });
//   const [cart, setCart] = useState([]);
//   const [editingService, setEditingService] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchServices = async () => {
//       if (!user?.email || !role) return;

//       setError("");
//       setLoading(true);
      
//       try {
//         const endpoint = role === "provider" 
//           ? `http://localhost:5000/api/services/geyser/provider/${encodeURIComponent(user.email)}`
//           : "http://localhost:5000/api/services/geyser";
        
//         const response = await fetch(endpoint);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         const servicesWithIds = data.map(service => ({
//           ...service,
//           _id: service._id || service.id
//         }));
        
//         setServices(servicesWithIds);
        
//         if (servicesWithIds.length === 0 && role === "provider") {
//           setError("No services found. Add your first service!");
//         }
//       } catch (err) {
//         console.error("Error fetching services:", err);
//         setError("Failed to load services. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, [user?.email, role]);

//   const handleProviderChange = (e) => {
//     setProviderInput({ ...providerInput, [e.target.name]: e.target.value });
//   };

//   const submitProviderService = async () => {
//     const { name, price, time, description } = providerInput;
//     if (!name || !price || !time || !description) {
//       setError("Please fill all fields");
//       return;
//     }

//     if (!user?.email) {
//       setError("Please login first");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const newService = { 
//         ...providerInput, 
//         providerEmail: user.email,
//         price: Number(price)
//       };

//       const response = await fetch("http://localhost:5000/api/services/geyser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newService),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
//       }

//       setServices(prev => [...prev, data.service || data]);
//       setProviderInput({ name: "", price: "", time: "", description: "" });
//       setError("");
//       toast.success("Service added successfully!");
//     } catch (err) {
//       console.error("Error adding service:", err);
//       setError(err.message || "Failed to add service. Please try again.");
//       toast.error("Failed to add service. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (service) => {
//     if (!user?.email) {
//       toast.error("Please login to add items to cart");
//       return;
//     }
//     if (!service._id) {
//       console.error('Service missing ID:', service);
//       setError("Invalid service data");
//       return;
//     }
//     setCart(prev => [...prev, service]);
//     toast.success("Added to cart!");
//   };

//   const bookService = async () => {
//     if (!cart.length) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const bookingData = {
//         serviceId: cart[0]._id,
//         customerEmail: user.email,
//         providerEmail: cart[0].providerEmail,
//         bookingDate: new Date().toISOString(),
//         address: user.address || "Address to be provided",
//         totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
//         specialInstructions: "Geyser service booking"
//       };

//       const response = await fetch("http://localhost:5000/api/bookings/geyser", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
//       }

//       setCart([]);
//       setError("");
//       toast.success("Services booked successfully!");
//     } catch (err) {
//       console.error("Error booking services:", err);
//       setError(err.message || "Failed to book services. Please try again.");+++
//       toast.error("Failed to book services. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = (userData) => {
//     if (userData && userData.email) {
//       console.log('Setting user data:', userData);
//       setUser(userData);
//     } else {
//       console.error('Invalid user data:', userData);
//       setError("Invalid login data received");
//     }
//   };

//   const geyserBackground = {
//     backgroundImage: 'url("YOUR_GEYSER_BACKGROUND_IMAGE_URL")',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     height: '100vh',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: '20px',
//   };

//   return (
//     <div className={`homecleaning-page ${role ? "no-bg" : ""}`}>
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading...</div>}
      
//       {!role && (
//         <section className="hero" style={geyserBackground}>
//           <div className="hero-content">
//             <h1>Geyser Services</h1>
//             <p>Installation, repair, and maintenance for your geyser.</p>
//             <div className="role-buttons">
//               <button onClick={() => setRole("provider")}>I'm a Service Provider</button>
//               <button onClick={() => setRole("customer")}>I'm a Customer</button>
//             </div>
//           </div>
//         </section>
//       )}

//       {role === "provider" && user && (
//         <div className="provider-form-section">
//           <h2>{editingService ? "Edit Service" : "Add Your Geyser Service"}</h2>
//           <input
//             type="text"
//             name="name"
//             placeholder="Service Name or Company"
//             value={providerInput.name}
//             onChange={handleProviderChange}
//             disabled={loading}
//           />
//           <input
//             type="text"
//             name="price"
//             placeholder="Price (₹)"
//             value={providerInput.price}
//             onChange={handleProviderChange}
//             disabled={loading}
//           />
//           <input
//             type="text"
//             name="time"
//             placeholder="Time Required (e.g., 2 hours)"
//             value={providerInput.time}
//             onChange={handleProviderChange}
//             disabled={loading}
//           />
//           <textarea
//             name="description"
//             placeholder="Service Description"
//             value={providerInput.description}
//             onChange={handleProviderChange}
//             disabled={loading}
//           />
//           <button 
//             onClick={submitProviderService}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : editingService ? "Update" : "Add Service"}
//           </button>

//           <div className="service-list">
//             <h3>Your Services</h3>
//             {services.map((service) => (
//               <div key={service._id} className="service-card">
//                 <h4>{service.name}</h4>
//                 <p><strong>Price:</strong> ₹{service.price}</p>
//                 <p><strong>Time:</strong> {service.time}</p>
//                 <p>{service.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {role === "customer" && user && (
//         <div className="customer-section">
//           <h3>Welcome, {user.email}</h3>
//           <h2 className="avail">Available Services</h2>
//           <div className="service-cards">
//             {services.map((service) => {
//               const serviceId = service._id || service.id;
//               if (!serviceId) {
//                 console.error('Service missing ID:', service);
//                 return null;
//               }
//               return (
//                 <div key={serviceId} className="service-card">
//                   <h3>{service.name}</h3>
//                   <p><strong>Price:</strong> ₹{service.price}</p>
//                   <p><strong>Time:</strong> {service.time}</p>
//                   <p>{service.description}</p>
//                   <button 
//                     onClick={() => addToCart(service)}
//                     disabled={loading}
//                   >
//                     🛒 Add to Cart
//                   </button>
//                 </div>
//               );
//             })}
//           </div>

//           {cart.length > 0 && (
//             <div className="cart-section">
//               <h3>Your Cart ({cart.length} items)</h3>
//               {cart.map((item, index) => {
//                 const itemId = item._id || item.id;
//                 return (
//                   <p key={`${itemId}-${index}`}>{item.name} - ₹{item.price}</p>
//                 );
//               })}
//               <button 
//                 className="book-btn"
//                 onClick={bookService}
//                 disabled={loading}
//               >
//                 {loading ? "Booking..." : "Book All"}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Geyser; 