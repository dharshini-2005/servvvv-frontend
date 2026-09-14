import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Styles/Checkout.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TAX_RATE = 0.08; // 8%
const PLATFORM_FEE = 20;

const COUPONS = {
  "SAVE10":  { type: "percent", value: 10,  label: "10% off" },
  "FLAT50":  { type: "flat",    value: 50,  label: "₹50 off" },
  "NEW100":  { type: "flat",    value: 100, label: "₹100 off for new users" },
  "CLEAN20": { type: "percent", value: 20,  label: "20% off on cleaning" },
};

const Checkout = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  // state passed from ServicePageLayout via navigate("/checkout", { state: {...} })
  const { cart = [], user, bookingEndpoint, serviceTitle = "Service" } = state || {};

  if (!state || !bookingEndpoint) {
    return (
      <div className="co-empty">
        <div className="co-empty-icon">⚠️</div>
        <p>Nothing to checkout. Please add services first.</p>
        <button onClick={() => navigate("/")}>← Go Home</button>
      </div>
    );
  }

  const [address, setAddress]         = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode]         = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [avoidCall, setAvoidCall]     = useState(false);
  const [qty, setQty]                 = useState(
    cart.reduce((acc, item) => ({ ...acc, [item._id]: 1 }), {})
  );
  const [loading, setLoading]         = useState(false);
  const [showBreakup, setShowBreakup] = useState(false);

  if (!cart.length) {
    return (
      <div className="co-empty">
        <div className="co-empty-icon">🛒</div>
        <p>No items to checkout.</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  /* ── calculations ── */
  const itemTotal    = cart.reduce((s, i) => s + Number(i.price) * (qty[i._id] || 1), 0);
  const taxAmount    = Math.round(itemTotal * TAX_RATE);
  const discount     = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round(itemTotal * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const grandTotal   = itemTotal + taxAmount + PLATFORM_FEE - discount;

  /* ── coupon ── */
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) { setCouponError("Enter a coupon code"); return; }
    if (COUPONS[code]) {
      setAppliedCoupon({ ...COUPONS[code], code });
      setCouponError("");
      toast.success(`Coupon "${code}" applied — ${COUPONS[code].label}!`);
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  /* ── qty helpers ── */
  const incQty = id => setQty(p => ({ ...p, [id]: (p[id] || 1) + 1 }));
  const decQty = id => setQty(p => ({ ...p, [id]: Math.max(1, (p[id] || 1) - 1) }));

  /* ── book ── */
  const handleConfirm = async () => {
    if (!address.trim())  { toast.error("Please enter your address"); return; }
    if (!pincode.trim())  { toast.error("Please enter your pincode"); return; }
    if (pincode.length !== 6 || isNaN(pincode)) { toast.error("Enter a valid 6-digit pincode"); return; }

    setLoading(true);
    try {
      const fullAddress = `${address}${addressLine2 ? ", " + addressLine2 : ""}, ${pincode}`;

      // All booking routes expect { bookings: [...] }
      const payload = {
        bookings: cart.map(s => ({
          serviceId:           s._id,
          customerEmail:       user.email.toLowerCase(),
          providerEmail:       s.providerEmail || "",
          bookingDate:         new Date().toISOString(),
          address:             fullAddress,
          totalAmount:         grandTotal,
          status:              "pending",
          specialInstructions: avoidCall ? "Avoid calling before reaching the location" : "",
        })),
      };

      const res  = await fetch(bookingEndpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      toast.success("🎉 Booking confirmed! Redirecting to your bookings…");
      setTimeout(() => navigate("/my-bookings", { state: { email: user.email } }), 1800);
    } catch (err) {
      toast.error(err.message || "Booking failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="co-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Header ── */}
      <div className="co-header">
        <button className="co-back" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="co-header-brand">
          <div className="co-brand-logo">SX</div>
          <span className="co-header-title">Checkout</span>
        </div>
        {user && (
          <button
            style={{ marginLeft:"auto", background:"none", border:"1px solid #e5e7eb", borderRadius:"8px", padding:"0.4rem 0.9rem", fontSize:"0.82rem", fontWeight:600, color:"#7c3aed", cursor:"pointer" }}
            onClick={() => navigate("/my-bookings", { state: { email: user.email } })}
          >
            📋 My Bookings
          </button>
        )}
      </div>

      <div className="co-layout">

        {/* ════ LEFT COLUMN ════ */}
        <div className="co-left">

          {/* Account box */}
          <div className="co-card">
            <div className="co-card-title">Account</div>
            {user ? (
              <div className="co-account-info">
                <div className="co-account-avatar">{(user.name || user.email)[0].toUpperCase()}</div>
                <div>
                  <div className="co-account-name">{user.name || "Customer"}</div>
                  <div className="co-account-email">{user.email}</div>
                </div>
                <span className="co-account-badge">✓ Logged in</span>
              </div>
            ) : (
              <div className="co-account-guest">
                <p>To book the service, please login or sign up</p>
                <button className="co-login-btn" onClick={() => navigate("/login")}>Login / Sign Up</button>
              </div>
            )}
          </div>

          {/* Address box */}
          <div className="co-card">
            <div className="co-card-title">
              📍 Service Address
              <span className="co-required">*</span>
            </div>
            <div className="co-field-group">
              <input
                className="co-input"
                placeholder="House / Flat No., Building, Street"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <input
                className="co-input"
                placeholder="Area, Landmark (optional)"
                value={addressLine2}
                onChange={e => setAddressLine2(e.target.value)}
              />
              <input
                className="co-input co-input-sm"
                placeholder="Pincode *"
                value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="co-card">
            <div className="co-card-title">Instructions</div>
            <label className="co-checkbox-row">
              <input
                type="checkbox"
                checked={avoidCall}
                onChange={e => setAvoidCall(e.target.checked)}
                className="co-checkbox"
              />
              <span>Avoid calling before reaching the location</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="co-card">
            <div className="co-card-title">
              <span className="co-coupon-icon">%</span> Coupons &amp; Offers
            </div>
            {appliedCoupon ? (
              <div className="co-coupon-applied">
                <div className="co-coupon-applied-left">
                  <span className="co-coupon-tick">✓</span>
                  <div>
                    <div className="co-coupon-code">{appliedCoupon.code}</div>
                    <div className="co-coupon-saving">You save ₹{discount}!</div>
                  </div>
                </div>
                <button className="co-coupon-remove" onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <div className="co-coupon-row">
                <input
                  className="co-input co-coupon-input"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  onKeyDown={e => e.key === "Enter" && applyCoupon()}
                />
                <button className="co-coupon-btn" onClick={applyCoupon}>Apply</button>
              </div>
            )}
            {couponError && <div className="co-coupon-error">{couponError}</div>}
            <div className="co-coupon-hint">Try: SAVE10 · FLAT50 · NEW100</div>
          </div>

        </div>

        {/* ════ RIGHT COLUMN ════ */}
        <div className="co-right">

          {/* Cart summary */}
          <div className="co-card">
            <div className="co-card-title">{serviceTitle}</div>
            {cart.map(item => (
              <div key={item._id} className="co-cart-row">
                <div className="co-cart-row-info">
                  <div className="co-cart-item-name">{item.name}</div>
                  <div className="co-cart-item-sub">⏱ {item.time}</div>
                  <ul className="co-cart-item-includes">
                    <li>{item.name} x{qty[item._id] || 1}</li>
                  </ul>
                </div>
                <div className="co-cart-row-right">
                  <div className="co-qty-control">
                    <button className="co-qty-btn" onClick={() => decQty(item._id)}>−</button>
                    <span className="co-qty-val">{qty[item._id] || 1}</span>
                    <button className="co-qty-btn" onClick={() => incQty(item._id)}>+</button>
                  </div>
                  <div className="co-cart-item-price">₹{Number(item.price) * (qty[item._id] || 1)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment summary */}
          <div className="co-card">
            <div className="co-card-title">Payment summary</div>

            <div className="co-pay-row">
              <span>Item total</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="co-pay-row">
              <span>Taxes &amp; Fee (8%)</span>
              <span>₹{taxAmount}</span>
            </div>
            <div className="co-pay-row">
              <span>Platform fee</span>
              <span>₹{PLATFORM_FEE}</span>
            </div>
            {appliedCoupon && (
              <div className="co-pay-row co-pay-discount">
                <span>Discount ({appliedCoupon.code})</span>
                <span>− ₹{discount}</span>
              </div>
            )}

            <div className="co-pay-divider" />

            <div className="co-pay-row co-pay-total">
              <span>Total amount</span>
              <span>₹{grandTotal}</span>
            </div>
            <div className="co-pay-row co-pay-total">
              <span>Amount to pay</span>
              <span>₹{grandTotal}</span>
            </div>

            <button className="co-breakup-btn" onClick={() => setShowBreakup(p => !p)}>
              {showBreakup ? "Hide breakup ▲" : "View breakup ▼"}
            </button>

            {showBreakup && (
              <div className="co-breakup-box">
                {cart.map(item => (
                  <div key={item._id} className="co-pay-row">
                    <span>{item.name} × {qty[item._id] || 1}</span>
                    <span>₹{Number(item.price) * (qty[item._id] || 1)}</span>
                  </div>
                ))}
                <div className="co-pay-row"><span>GST (8%)</span><span>₹{taxAmount}</span></div>
                <div className="co-pay-row"><span>Platform fee</span><span>₹{PLATFORM_FEE}</span></div>
                {appliedCoupon && <div className="co-pay-row co-pay-discount"><span>Coupon</span><span>− ₹{discount}</span></div>}
              </div>
            )}
          </div>

          {/* Confirm button */}
          <button
            className="co-confirm-btn"
            onClick={handleConfirm}
            disabled={loading || !user}
          >
            {loading
              ? <span className="co-spinner" />
              : <>Confirm Booking &nbsp;·&nbsp; ₹{grandTotal}</>
            }
          </button>

          {!user && (
            <p className="co-login-hint">Please login to confirm your booking</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
