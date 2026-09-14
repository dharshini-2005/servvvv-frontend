import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Plumbing Services",
  subtitle:        "Fast, reliable plumbing repairs and installations for your home.",
  heroImage:       "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&auto=format&fit=crop",
  emoji:           "🔧",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/plumbing",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/plumbing",
  serviceLabel:    "Plumbing Services",
  providerFormTitle: "Add Plumbing Service",
  bookingPayload: (cart, user, address) => ({
    bookings: cart.map(s => ({
      serviceId:     s._id,
      customerEmail: user.email,
      status:        "pending",
      bookingDate:   new Date().toISOString(),
      address:       address || "Address to be provided",
    })),
  }),
};

const Plumbing = () => <ServicePageLayout config={config} />;
export default Plumbing;
