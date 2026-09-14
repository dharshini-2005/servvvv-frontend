import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/MyBookings.css";

const BASE = "https://servease-backend-870h.onrender.com/api/bookings";
const AUTO_REFRESH_SEC = 30;

const SERVICES = [
  { key: "home-cleaning",      label: "Home Cleaning",          emoji: "🏠", param: "email" },
  { key: "sofa-carpet",        label: "Sofa & Carpet",          emoji: "🛋️", param: "email" },
  { key: "ac",                 label: "AC Service",             emoji: "❄️", param: "email" },
  { key: "washing-machine",    label: "Washing Machine",        emoji: "🌀", param: "customerEmail" },
  { key: "plumbing",           label: "Plumbing",               emoji: "🔧", param: "email" },
  { key: "carpentry",          label: "Carpentry",              emoji: "🪚", param: "email" },
  { key: "television",         label: "Television",             emoji: "📺", param: "customerEmail" },
  { key: "electrical",         label: "Electrical",             emoji: "⚡", param: "customerEmail" },
  { key: "cockroach-ant-pest", label: "Pest Control",           emoji: "🐜", param: "email" },
  { key: "bathroom",           label: "Bathroom Cleaning",      emoji: "🚿", param: "email" },
  { key: "geyser",             label: "Geyser Repair",          emoji: "🔥", param: "email" },
  { key: "pest-control",       label: "Pest Control (General)", emoji: "🌿", param: "customerEmail" },
];

const STATUS_CFG = {
  pending:   { label: "Pending",   color: "#d97706", bg: "#fef9c3", border: "#fcd34d", icon: "⏳", step: 0 },
  confirmed: { label: "Confirmed", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", icon: "🔵", step: 1 },
  completed: { label: "Completed", color: "#16a34a", bg: "#f0fdf4", border: "#86efac", icon: "🎉", step: 2 },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: "❌", step: -1 },
  accepted:  { label: "Accepted",  color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", icon: "✅", step: 1 },
  rejected:  { label: "Rejected",  color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: "❌", step: -1 },
};

const TIMELINE_STEPS = [
  { key: "pending",   label: "Booking Placed",      icon: "📋" },
  { key: "confirmed", label: "Provider Confirmed",   icon: "👷" },
  { key: "completed", label: "Service Completed",    icon: "🎉" },
];

const fmt = d => d
  ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  : "—";

const MyBookings = () => {
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const email       = state?.email || "";

  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SEC);
  const [lastRefresh, setLastRefresh] = useState(null);
  const timerRef = useRef(null);

  /* ── fetch all bookings ── */
  const fetchAll = useCallback(async (silent = false) => {
    if (!email) return;
    silent ? setRefreshing(true) : setLoading(true);

    const results = await Promise.allSettled(
      SERVICES.map(s =>
        fetch(`${BASE}/${s.key}/customer/${encodeURIComponent(email.toLowerCase())}`)
          .then(r => r.ok ? r.json() : [])
          .then(data => {
            const arr = Array.isArray(data) ? data : (data.bookings || []);
            return arr.map(b => ({ ...b, _serviceKey: s.key, _serviceLabel: s.label, _serviceEmoji: s.emoji }));
          })
          .catch(() => [])
      )
    );

    const all = results
      .filter(r => r.status === "fulfilled")
      .flatMap(r => r.value)
      .sort((a, b) => new Date(b.bookingDate || b.createdAt || 0) - new Date(a.bookingDate || a.createdAt || 0));

    setBookings(all);
    setLastRefresh(new Date());
    setCountdown(AUTO_REFRESH_SEC);
    silent ? setRefreshing(false) : setLoading(false);
  }, [email]);

  /* initial load */
  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* auto-refresh countdown */
  useEffect(() => {
    if (!email) return;
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { fetchAll(true); return AUTO_REFRESH_SEC; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [fetchAll, email]);

  if (!email) return (
    <div className="mb-no-user">
      <div className="mb-no-user-icon">👤</div>
      <p>Please log in to view your bookings.</p>
      <button onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  /* derived data */
  const counts = bookings.reduce((acc, b) => {
    const s = (b.status || "pending").toLowerCase();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const filtered = bookings.filter(b => {
    const status = (b.status || "pending").toLowerCase();
    const matchFilter = filter === "all" || status === filter;
    const name = (b.serviceId?.name || b._serviceLabel || "").toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || b._serviceLabel.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="mb-page">
      {/* ── Header ── */}
      <div className="mb-header">
        <button className="mb-back" onClick={() => navigate(-1)} title="Go back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="mb-header-brand">
          <div className="mb-brand-logo">SX</div>
          <span className="mb-header-title">My Bookings</span>
        </div>
        <div className="mb-header-right">
          {/* Refresh button + countdown */}
          <button
            className={`mb-refresh-btn${refreshing ? " mb-refresh-spin" : ""}`}
            onClick={() => fetchAll(true)}
            title="Refresh bookings"
            disabled={refreshing}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {refreshing ? "Refreshing…" : `Refresh (${countdown}s)`}
          </button>
          <span className="mb-header-email">👤 {email}</span>
        </div>
      </div>

      <div className="mb-layout">

        {/* ── Last refresh notice ── */}
        {lastRefresh && !loading && (
          <div className="mb-last-refresh">
            Last updated: {lastRefresh.toLocaleTimeString("en-IN")} · auto-refreshes every {AUTO_REFRESH_SEC}s
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="mb-stats-row">
          {[
            { key: "all",       label: "All",       count: bookings.length,       icon: "📋" },
            { key: "pending",   label: "Pending",   count: counts.pending   || 0, icon: "⏳" },
            { key: "confirmed", label: "Confirmed", count: counts.confirmed || 0, icon: "🔵" },
            { key: "completed", label: "Completed", count: counts.completed || 0, icon: "🎉" },
            { key: "cancelled", label: "Cancelled", count: counts.cancelled || 0, icon: "❌" },
          ].map(f => (
            <button
              key={f.key}
              className={`mb-stat-card${filter === f.key ? " mb-stat-active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              <span className="mb-stat-icon">{f.icon}</span>
              <span className="mb-stat-count">{f.count}</span>
              <span className="mb-stat-label">{f.label}</span>
            </button>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="mb-search-row">
          <div className="mb-search-wrap">
            <span className="mb-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input
              className="mb-search-input"
              placeholder="Search by service name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="mb-search-clear" onClick={() => setSearch("")}>×</button>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="mb-loading">
            <div className="mb-spinner" />
            <p>Fetching your bookings…</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filtered.length === 0 && (
          <div className="mb-empty">
            <div className="mb-empty-icon">📭</div>
            <p className="mb-empty-title">No bookings found</p>
            <p className="mb-empty-sub">
              {filter !== "all"
                ? `You have no ${filter} bookings.`
                : "You haven't booked any service yet. Browse services to get started!"}
            </p>
            <button className="mb-explore-btn" onClick={() => navigate("/")}>
              Explore Services →
            </button>
          </div>
        )}

        {/* ── Booking cards ── */}
        {!loading && filtered.length > 0 && (
          <div className="mb-list">
            {filtered.map((b, idx) => {
              const status = (b.status || "pending").toLowerCase();
              const cfg    = STATUS_CFG[status] || STATUS_CFG.pending;
              const serviceName  = b.serviceId?.name || "Service";
              const serviceTime  = b.serviceId?.time  || "";
              const servicePrice = b.totalAmount || b.serviceId?.price || b.price;
              const isCompleted  = status === "completed";
              const isCancelled  = status === "cancelled";
              const isConfirmed  = status === "confirmed";

              return (
                <div
                  key={b._id || idx}
                  className={`mb-card${isCompleted ? " mb-card-completed" : ""}${isCancelled ? " mb-card-cancelled" : ""}`}
                >
                  {/* ── Completed banner ── */}
                  {isCompleted && (
                    <div className="mb-completed-banner">
                      <span className="mb-completed-icon">🎉</span>
                      <div>
                        <div className="mb-completed-title">Service Completed!</div>
                        <div className="mb-completed-sub">Your {b._serviceLabel} service has been successfully completed by the provider.</div>
                      </div>
                    </div>
                  )}

                  {/* ── Confirmed banner ── */}
                  {isConfirmed && (
                    <div className="mb-confirmed-banner">
                      <span>🔵</span>
                      <div>
                        <div style={{ fontWeight:700, fontSize:"0.9rem" }}>Provider Confirmed</div>
                        <div style={{ fontSize:"0.82rem", opacity:0.9 }}>Your provider has accepted the booking and will arrive soon.</div>
                      </div>
                    </div>
                  )}

                  {/* Card header */}
                  <div className="mb-card-header">
                    <div className="mb-card-emoji">{b._serviceEmoji}</div>
                    <div className="mb-card-info">
                      <div className="mb-card-service-label">{b._serviceLabel}</div>
                      <div className="mb-card-name">{serviceName}</div>
                    </div>
                    <span
                      className="mb-status-badge"
                      style={{ color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
                    >
                      {cfg.icon} {cfg.label}
                    </span>
                  </div>

                  {/* ── Timeline (not for cancelled) ── */}
                  {!isCancelled && (
                    <div className="mb-timeline">
                      {TIMELINE_STEPS.map((step, i) => {
                        const done    = cfg.step > i;
                        const current = cfg.step === i;
                        return (
                          <React.Fragment key={step.key}>
                            <div className={`mb-tl-step${done ? " mb-tl-done" : ""}${current ? " mb-tl-current" : ""}`}>
                              <div className="mb-tl-dot">
                                {done ? "✓" : current ? step.icon : ""}
                              </div>
                              <div className="mb-tl-label">{step.label}</div>
                            </div>
                            {i < TIMELINE_STEPS.length - 1 && (
                              <div className={`mb-tl-line${done ? " mb-tl-line-done" : ""}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}

                  <div className="mb-card-divider" />

                  {/* Details grid */}
                  <div className="mb-card-details">
                    {(b.bookingDate || b.createdAt) && (
                      <div className="mb-detail">
                        <span className="mb-detail-label">📅 Booked on</span>
                        <span className="mb-detail-value">{fmt(b.bookingDate || b.createdAt)}</span>
                      </div>
                    )}
                    {serviceTime && (
                      <div className="mb-detail">
                        <span className="mb-detail-label">⏱ Duration</span>
                        <span className="mb-detail-value">{serviceTime}</span>
                      </div>
                    )}
                    {servicePrice && (
                      <div className="mb-detail">
                        <span className="mb-detail-label">💰 Amount Paid</span>
                        <span className="mb-detail-value mb-price">₹{servicePrice}</span>
                      </div>
                    )}
                    {b.address && (
                      <div className="mb-detail mb-detail-full">
                        <span className="mb-detail-label">📍 Service Address</span>
                        <span className="mb-detail-value">{b.address}</span>
                      </div>
                    )}
                    {b.providerEmail && (
                      <div className="mb-detail">
                        <span className="mb-detail-label">👷 Provider</span>
                        <span className="mb-detail-value">{b.providerEmail}</span>
                      </div>
                    )}
                    {b.specialInstructions && (
                      <div className="mb-detail mb-detail-full">
                        <span className="mb-detail-label">📝 Notes</span>
                        <span className="mb-detail-value">{b.specialInstructions}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mb-card-footer">
                    <span className="mb-booking-id">
                      ID: {b._id?.slice(-8).toUpperCase() || "—"}
                    </span>
                    <span className="mb-track-note" style={{ color: cfg.color }}>
                      {status === "pending"   && "⏳ Waiting for provider to confirm"}
                      {status === "confirmed" && "🚀 Provider is on their way"}
                      {status === "completed" && "✅ Service done — thank you!"}
                      {status === "cancelled" && "This booking was cancelled"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
