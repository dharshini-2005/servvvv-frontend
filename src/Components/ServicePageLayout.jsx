/**
 * ServicePageLayout — shared Urban Company style layout
 * Used by: ACService, HomeCleaning, Television, Bathroom,
 *          WashingMachine, Plumbing, Electrical, SofaCarpet,
 *          CockroachAntPestControl, Carpentry
 *
 * Props:
 *   config: {
 *     title, subtitle, heroImage, apiBase,
 *     serviceEndpoint, bookingEndpoint,
 *     emoji, extraFields   // array of {name, placeholder, type}
 *     bookingPayload       // fn(cart, user) => object
 *   }
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderLogin from "./ProviderLogin";
import CustomerLogin from "./CustomerLogin";
import "../Styles/ServicePage.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* service image placeholders per emoji */
const EMOJI_BG = {
  "❄️": "#eff6ff", "🌀": "#f0f9ff", "📺": "#1e293b",
  "🚿": "#ecfeff", "🏠": "#f0fdf4", "🛋️": "#fdf4ff",
  "🪚": "#fefce8", "🔧": "#fff7ed", "⚡": "#fefce8",
  "🎨": "#fdf2f8", "🐜": "#f0fdf4",
};

const ServicePageLayout = ({ config }) => {
  const {
    title, subtitle, heroImage, emoji = "🔧",
    serviceEndpoint, bookingEndpoint,
    extraFields = [],
    bookingPayload,
    providerFormTitle,
    serviceLabel = "Services",
  } = config;

  const navigate = useNavigate();
  const [role, setRole]       = useState("");
  const [user, setUser]       = useState(null);
  const [services, setServices] = useState([]);
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders]   = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("services"); // "services" | "orders"

  // provider form
  const baseFields = { name: "", price: "", time: "", description: "" };
  const extraDefault = extraFields.reduce((a, f) => ({ ...a, [f.name]: "" }), {});
  const [form, setForm]       = useState({ ...baseFields, ...extraDefault });
  const [editing, setEditing] = useState(null);

  /* ── fetch services ── */
  useEffect(() => {
    if (!user?.email || !role) return;
    setLoading(true);
    const url = role === "provider"
      ? `${serviceEndpoint}/provider/${encodeURIComponent(user.email)}`
      : serviceEndpoint;

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        // normalize: some models return id instead of _id due to toJSON()
        setServices(arr.map(s => ({ ...s, _id: s._id || s.id })));
      })
      .catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false));
  }, [user?.email, role, serviceEndpoint]);

  /* ── fetch provider orders ── */
  useEffect(() => {
    if (role !== "provider" || !user?.email || activeTab !== "orders") return;
    setOrdersLoading(true);
    fetch(`${bookingEndpoint}/provider/${encodeURIComponent(user.email)}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.bookings || []);
        setOrders(arr.sort((a, b) => new Date(b.bookingDate || b.createdAt || 0) - new Date(a.bookingDate || a.createdAt || 0)));
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setOrdersLoading(false));
  }, [role, user?.email, bookingEndpoint, activeTab]);

  /* ── provider: add / edit ── */
  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submitService = async () => {
    const required = ["name", "price", "time", "description", ...extraFields.map(f => f.name)];
    if (required.some(k => !form[k])) { toast.warn("Please fill all fields"); return; }

    setLoading(true);
    try {
      const payload = { ...form, providerEmail: user.email, price: Number(form.price) };
      const url    = editing ? `${serviceEndpoint}/${editing._id}` : serviceEndpoint;
      const method = editing ? "PUT" : "POST";

      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      if (editing) {
        setServices(p => p.map(s => s._id === editing._id ? { ...data, _id: data._id || data.id } : s));
        setEditing(null);
        toast.success("Service updated!");
      } else {
        setServices(p => [...p, { ...data, _id: data._id || data.id }]);
        toast.success("Service added!");
      }
      setForm({ ...baseFields, ...extraDefault });
    } catch (err) {
      toast.error(err.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = s => {
    setEditing(s);
    setForm({ name: s.name, price: s.price, time: s.time, description: s.description,
              ...extraFields.reduce((a, f) => ({ ...a, [f.name]: s[f.name] || "" }), {}) });
  };

  const deleteService = async id => {
    if (!window.confirm("Delete this service?")) return;
    setLoading(true);
    try {
      // support both _id and id field names
      const serviceId = id || id?._id;
      const res = await fetch(`${serviceEndpoint}/${serviceId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setServices(p => p.filter(s => (s._id || s.id) !== serviceId));
      toast.success("Service deleted");
    } catch (err) { toast.error(err.message || "Failed to delete"); }
    finally { setLoading(false); }
  };

  /* ── cart ── */
  const addToCart = s => {
    if (cart.some(i => i._id === s._id)) return;
    // ensure providerEmail is stored with cart item
    setCart(p => [...p, { ...s, providerEmail: s.providerEmail || s.provider_email || "" }]);
    toast.success(`${s.name} added to cart`);
  };
  const removeFromCart = id => setCart(p => p.filter(i => i._id !== id));
  const cartTotal = cart.reduce((s, i) => s + Number(i.price), 0);

  /* ── book ── */
  const book = async () => {
    if (!cart.length) { toast.error("Your cart is empty"); return; }
    if (!address.trim()) { toast.error("Please enter your address to proceed"); return; }
    setLoading(true);
    try {
      const payload = bookingPayload
        ? bookingPayload(cart, user, address)
        : {
            bookings: cart.map(s => ({
              serviceId: s._id,
              customerEmail: user.email,
              providerEmail: s.providerEmail,
              bookingDate: new Date().toISOString(),
              address: address || "To be provided",
              totalAmount: cartTotal,
            }))
          };

      const res  = await fetch(bookingEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      setCart([]);
      setAddress("");
      toast.success("🎉 Booking confirmed!");
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = userData => {
    if (userData?.email) setUser(userData);
    else toast.error("Login failed");
  };

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */

  /* ── 1. Role select ── */
  if (!role) return (
    <div className="sp-hero" style={{ backgroundImage: `url("${heroImage}")` }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="sp-hero-box">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <div className="sp-role-btns">
          <button onClick={() => setRole("provider")}>I'm a Provider</button>
          <button onClick={() => setRole("customer")}>I'm a Customer</button>
        </div>
      </div>
    </div>
  );

  /* ── 2. Auth ── */
  if (!user) return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {role === "provider"
        ? <ProviderLogin onLogin={handleLogin} />
        : <CustomerLogin onLogin={handleLogin} />}
    </>
  );

  /* ── 3. Provider dashboard ── */
  if (role === "provider") {
    const STATUS_STYLE = {
      pending:   { color: "#d97706", bg: "#fef9c3", icon: "⏳" },
      confirmed: { color: "#2563eb", bg: "#eff6ff", icon: "✅" },
      completed: { color: "#16a34a", bg: "#f0fdf4", icon: "🎉" },
      cancelled: { color: "#dc2626", bg: "#fef2f2", icon: "❌" },
    };
    const fmtDate = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";

    return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", paddingBottom: "3rem" }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top bar */}
      <div className="sp-topbar">
        <div className="sp-topbar-left">
          <button className="sp-back-btn" onClick={() => { setRole(""); setUser(null); }}>← Back</button>
          <span className="sp-topbar-title">{emoji} {title} — Provider</span>
        </div>
        <span className="sp-topbar-user">👤 {user.email}</span>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"1.5rem", borderBottom:"2px solid #e5e7eb", paddingBottom:"0" }}>
          {[
            { key:"services", label:`📋 My Services (${services.length})` },
            { key:"orders",   label:`📦 Orders Received (${orders.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
              padding:"0.65rem 1.25rem", border:"none", background:"none",
              fontWeight: activeTab === t.key ? 700 : 500,
              color: activeTab === t.key ? "#7c3aed" : "#6b7280",
              borderBottom: activeTab === t.key ? "3px solid #7c3aed" : "3px solid transparent",
              cursor:"pointer", fontSize:"0.92rem", transition:"all 0.15s",
              marginBottom:"-2px",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── SERVICES TAB ── */}
        {activeTab === "services" && (
          <>
            {/* Add/Edit form */}
            <div className="sp-provider-wrap">
              <h2>{editing ? "Edit Service" : (providerFormTitle || `Add ${title} Service`)}</h2>
              <input name="name" placeholder="Service name" value={form.name} onChange={handleFormChange} disabled={loading} />
              <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleFormChange} disabled={loading} min="1" />
              <input name="time" placeholder="Duration (e.g. 2 hours)" value={form.time} onChange={handleFormChange} disabled={loading} />
              {extraFields.map(f => f.type === "select" ? (
                <select key={f.name} name={f.name} value={form[f.name]} onChange={handleFormChange} disabled={loading}>
                  <option value="">{f.placeholder}</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input key={f.name} name={f.name} placeholder={f.placeholder} value={form[f.name]} onChange={handleFormChange} disabled={loading} />
              ))}
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleFormChange} disabled={loading} />
              <button className="sp-submit-btn" onClick={submitService} disabled={loading}>
                {loading ? "Saving…" : editing ? "Update Service" : "Add Service"}
              </button>
              {editing && (
                <button style={{ width:"100%", marginTop:"0.5rem", padding:"0.75rem", background:"#fef2f2", color:"#dc2626", border:"1px solid #fecaca", borderRadius:"8px", fontWeight:600, cursor:"pointer" }}
                  onClick={() => { setEditing(null); setForm({ ...baseFields, ...extraDefault }); }}>
                  Cancel Edit
                </button>
              )}
            </div>

            {/* Service cards */}
            {services.length > 0 && (
              <div className="sp-provider-services" style={{ marginTop:"2rem" }}>
                <h3>Your Listed {serviceLabel} ({services.length})</h3>
                <div className="sp-prov-cards">
                  {services.map(s => (
                    <div key={s._id} className="sp-prov-card">
                      <h4>{s.name || "—"}</h4>
                      <p>₹{s.price} &nbsp;·&nbsp; {s.time}</p>
                      {extraFields.map(f => s[f.name] && <p key={f.name}><strong>{f.label || f.placeholder}:</strong> {s[f.name]}</p>)}
                      <p style={{ WebkitLineClamp:2, display:"-webkit-box", WebkitBoxOrient:"vertical", overflow:"hidden", color:"#6b7280", fontSize:"0.85rem" }}>{s.description}</p>
                      <div className="sp-prov-actions">
                        <button onClick={() => startEdit(s)} disabled={loading}>✏️ Edit</button>
                        <button onClick={() => deleteService(s._id || s.id)} disabled={loading}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <div>
            {ordersLoading && (
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", color:"#7c3aed", padding:"3rem 0" }}>
                <span style={{ width:24, height:24, border:"3px solid #ede9fe", borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />
                Loading orders…
              </div>
            )}

            {!ordersLoading && orders.length === 0 && (
              <div style={{ textAlign:"center", padding:"4rem 2rem", color:"#9ca3af" }}>
                <div style={{ fontSize:"3.5rem", marginBottom:"1rem" }}>📭</div>
                <p style={{ fontSize:"1.05rem", fontWeight:600, color:"#374151" }}>No orders yet</p>
                <p style={{ fontSize:"0.9rem" }}>When customers book your services, they'll appear here.</p>
              </div>
            )}

            {!ordersLoading && orders.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
                {orders.map((o, idx) => {
                  const status = (o.status || "pending").toLowerCase();
                  const cfg = STATUS_STYLE[status] || STATUS_STYLE.pending;
                  const svcName = o.serviceId?.name || o.serviceName || "Service";

                  /* ── build status-update URL for this booking endpoint ── */
                  const statusUrl = (() => {
                    const ep = bookingEndpoint; // e.g. https://servease-backend-870h.onrender.com/api/bookings/home-cleaning
                    const id = o._id;
                    // routes that use /:id/status
                    if (/home-cleaning|electrical|television|washing-machine|cockroach/.test(ep))
                      return { url: `${ep}/${id}/status`, method: "PATCH" };
                    // everything else uses /:id directly
                    return { url: `${ep}/${id}`, method: "PUT" };
                  })();

                  const updateStatus = async (newStatus) => {
                    if (!window.confirm(`Mark this order as "${newStatus}"?`)) return;
                    try {
                      const res = await fetch(statusUrl.url, {
                        method: statusUrl.method,
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: newStatus }),
                      });
                      if (!res.ok) throw new Error(`HTTP ${res.status}`);
                      // update locally
                      setOrders(prev => prev.map(ord =>
                        ord._id === o._id ? { ...ord, status: newStatus } : ord
                      ));
                      toast.success(`Order marked as "${newStatus}"`);
                    } catch (err) {
                      toast.error("Failed to update status. Try again.");
                    }
                  };

                  return (
                    <div key={o._id || idx} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:"14px", padding:"1.25rem 1.5rem", boxShadow:"0 1px 4px rgba(0,0,0,0.05)", display:"flex", flexDirection:"column", gap:"0.75rem" }}>
                      {/* Header row */}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                          <div style={{ width:42, height:42, background:"#f5f3ff", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", flexShrink:0 }}>
                            {emoji}
                          </div>
                          <div>
                            <div style={{ fontSize:"1rem", fontWeight:700, color:"#111827" }}>{svcName}</div>
                            <div style={{ fontSize:"0.78rem", color:"#7c3aed", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{title}</div>
                          </div>
                        </div>
                        <span style={{ padding:"0.32rem 0.85rem", borderRadius:"50px", fontSize:"0.8rem", fontWeight:700, color:cfg.color, background:cfg.bg, whiteSpace:"nowrap", flexShrink:0 }}>
                          {cfg.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>

                      {/* Details */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.6rem" }}>
                        <div>
                          <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontWeight:500 }}>👤 Customer</div>
                          <div style={{ fontSize:"0.88rem", color:"#374151", fontWeight:600 }}>{o.customerEmail || "—"}</div>
                        </div>
                        <div>
                          <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontWeight:500 }}>📅 Booked on</div>
                          <div style={{ fontSize:"0.88rem", color:"#374151" }}>{fmtDate(o.bookingDate || o.createdAt)}</div>
                        </div>
                        {(o.totalAmount || o.serviceId?.price) && (
                          <div>
                            <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontWeight:500 }}>💰 Amount</div>
                            <div style={{ fontSize:"0.88rem", color:"#7c3aed", fontWeight:700 }}>₹{o.totalAmount || o.serviceId?.price}</div>
                          </div>
                        )}
                        {o.address && (
                          <div style={{ gridColumn:"1/-1" }}>
                            <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontWeight:500 }}>📍 Address</div>
                            <div style={{ fontSize:"0.88rem", color:"#374151" }}>{o.address}</div>
                          </div>
                        )}
                        {o.specialInstructions && (
                          <div style={{ gridColumn:"1/-1" }}>
                            <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontWeight:500 }}>📝 Instructions</div>
                            <div style={{ fontSize:"0.88rem", color:"#374151" }}>{o.specialInstructions}</div>
                          </div>
                        )}
                      </div>

                      {/* ── Action buttons ── */}
                      {status !== "completed" && status !== "cancelled" && (
                        <div style={{ display:"flex", gap:"0.6rem", flexWrap:"wrap", paddingTop:"0.5rem", borderTop:"1px solid #f3f4f6" }}>
                          {status === "pending" && (
                            <button onClick={() => updateStatus("confirmed")} style={{
                              flex:1, minWidth:120, padding:"0.6rem 1rem",
                              background:"#eff6ff", color:"#2563eb",
                              border:"1.5px solid #93c5fd", borderRadius:"8px",
                              fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
                              transition:"all 0.15s",
                            }}
                              onMouseOver={e => e.currentTarget.style.background="#2563eb" || (e.currentTarget.style.color="#fff")}
                              onMouseOut={e => e.currentTarget.style.background="#eff6ff" || (e.currentTarget.style.color="#2563eb")}
                            >
                              ✅ Confirm Order
                            </button>
                          )}
                          {(status === "pending" || status === "confirmed") && (
                            <button onClick={() => updateStatus("completed")} style={{
                              flex:1, minWidth:120, padding:"0.6rem 1rem",
                              background:"#f0fdf4", color:"#16a34a",
                              border:"1.5px solid #86efac", borderRadius:"8px",
                              fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
                              transition:"all 0.15s",
                            }}
                              onMouseOver={e => { e.currentTarget.style.background="#16a34a"; e.currentTarget.style.color="#fff"; }}
                              onMouseOut={e => { e.currentTarget.style.background="#f0fdf4"; e.currentTarget.style.color="#16a34a"; }}
                            >
                              🎉 Mark as Completed
                            </button>
                          )}
                          <button onClick={() => updateStatus("cancelled")} style={{
                            flex:1, minWidth:100, padding:"0.6rem 1rem",
                            background:"#fef2f2", color:"#dc2626",
                            border:"1.5px solid #fca5a5", borderRadius:"8px",
                            fontWeight:700, fontSize:"0.88rem", cursor:"pointer",
                            transition:"all 0.15s",
                          }}
                            onMouseOver={e => { e.currentTarget.style.background="#dc2626"; e.currentTarget.style.color="#fff"; }}
                            onMouseOut={e => { e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.color="#dc2626"; }}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      )}

                      {/* Completed / Cancelled banner */}
                      {status === "completed" && (
                        <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:"8px", padding:"0.6rem 1rem", fontSize:"0.88rem", color:"#16a34a", fontWeight:600 }}>
                          🎉 Work completed! The customer has been notified.
                        </div>
                      )}
                      {status === "cancelled" && (
                        <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:"8px", padding:"0.6rem 1rem", fontSize:"0.88rem", color:"#dc2626", fontWeight:600 }}>
                          ❌ This order was cancelled.
                        </div>
                      )}

                      {/* Order ID footer */}
                      <div style={{ fontSize:"0.74rem", color:"#9ca3af", fontFamily:"monospace", background:"#f9fafb", padding:"0.22rem 0.65rem", borderRadius:"4px", border:"1px solid #e5e7eb", width:"fit-content" }}>
                        Order ID: {(o._id || "").slice(-8).toUpperCase() || "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );}

  /* ── 4. Customer dashboard (UC style) ── */
  return (
    <div className="sp-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Top bar */}
      <div className="sp-topbar">
        <div className="sp-topbar-left">
          <button className="sp-back-btn" onClick={() => { setRole(""); setUser(null); }}>
            ← Back
          </button>
          <span className="sp-topbar-title">{emoji} {title}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <button
            className="sp-back-btn"
            style={{ background:"rgba(255,255,255,0.18)", fontWeight:700 }}
            onClick={() => navigate("/my-bookings", { state: { email: user.email } })}
          >
            📋 My Bookings
          </button>
          <span className="sp-topbar-user">👤 {user.name || user.email}</span>
        </div>
      </div>

      <div className="sp-layout">
        {/* ─ Left column ─ */}
        <div className="sp-left">
          {/* Service header */}
          <div className="sp-service-header">
            <h1>{title}</h1>
            <div className="sp-rating-row">
              <span className="sp-rating-star">⭐ 4.8</span>
              <span className="sp-bookings-text">(2.3K+ bookings)</span>
            </div>
          </div>

          <div className="sp-section-title">{serviceLabel}</div>

          {/* Loading */}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", color:"#7c3aed", padding:"2rem 0" }}>
              <span style={{ width:20, height:20, border:"3px solid #ede9fe", borderTopColor:"#7c3aed", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }} />
              Loading services…
            </div>
          )}

          {/* Empty */}
          {!loading && services.length === 0 && (
            <div className="sp-empty">
              <div className="sp-empty-icon">{emoji}</div>
              <p>No {serviceLabel.toLowerCase()} available yet.</p>
            </div>
          )}

          {/* Service list */}
          {services.map((s, idx) => {
            const inCart = cart.some(i => i._id === s._id);
            return (
              <div key={s._id} className="sp-service-card">
                {/* Info */}
                <div className="sp-card-info">
                  <div className="sp-card-name">{s.name}</div>
                  <div className="sp-card-rating">
                    <span className="star">⭐</span>
                    <span>4.{7 + (idx % 3)} ({(100 + idx * 37).toLocaleString()} reviews)</span>
                  </div>
                  <div className="sp-card-price">
                    ₹{s.price} <span>· {s.time}</span>
                  </div>
                  <div className="sp-card-desc">{s.description}</div>
                  {extraFields.map(f => s[f.name] && (
                    <span key={f.name} className="sp-card-time" style={{ marginRight:"0.4rem", marginBottom:"0.3rem" }}>
                      {s[f.name]}
                    </span>
                  ))}
                </div>

                {/* Image + Add */}
                <div className="sp-card-right">
                  <div className="sp-card-img" style={{ background: EMOJI_BG[emoji] || "#f1f5f9" }}>
                    <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
                  </div>
                  {inCart ? (
                    <div className="sp-added-btn">✓ Added</div>
                  ) : (
                    <button className="sp-add-btn" onClick={() => addToCart(s)} disabled={loading}>
                      Add
                    </button>
                  )}
                  <span className="sp-card-options">1 option</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─ Right column ─ */}
        <div className="sp-right">
          {/* UC Promise */}
          <div className="sp-promise-box">
            <div className="sp-promise-title">ServiceX Promise</div>
            {["Verified Professionals", "Hassle Free Booking", "Transparent Pricing", "On-time Service"].map(t => (
              <div key={t} className="sp-promise-item">
                <div className="sp-promise-check">✓</div>
                <span>{t}</span>
              </div>
            ))}
          </div>

          {/* Cart */}
          <div className="sp-cart-box">
            <div className="sp-cart-title">
              <span>Your Cart</span>
              {cart.length > 0 && <span className="sp-cart-count">{cart.length}</span>}
            </div>

            {cart.length === 0 ? (
              <div className="sp-cart-empty">
                <div className="sp-cart-empty-img">🛒</div>
                <p>No items in your cart</p>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item._id} className="sp-cart-item">
                    <span className="sp-cart-item-name">{item.name}</span>
                    <span className="sp-cart-item-price">₹{item.price}</span>
                    <button className="sp-cart-remove" onClick={() => removeFromCart(item._id)} title="Remove">×</button>
                  </div>
                ))}

                <div className="sp-cart-divider" />
                <div className="sp-cart-total-row">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>

                <button
                  className="sp-book-btn"
                  onClick={() => navigate("/checkout", {
                    state: {
                      cart,
                      user,
                      bookingEndpoint,
                      serviceTitle: title,
                    }
                  })}
                  disabled={!cart.length}
                >
                  Proceed to Checkout →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePageLayout;
