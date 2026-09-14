import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Carpentry Services",
  subtitle:        "Professional carpentry for furniture repair, installation and custom work.",
  heroImage:       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&auto=format&fit=crop",
  emoji:           "🪚",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/carpentry",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/carpentry",
  serviceLabel:    "Carpentry Services",
  providerFormTitle: "Add Carpentry Service",
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

const Carpentry = () => <ServicePageLayout config={config} />;
export default Carpentry;
