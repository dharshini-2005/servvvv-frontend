import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Electrical Services",
  subtitle:        "Safe, certified electrical repairs and installations for your home.",
  heroImage:       "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1400&auto=format&fit=crop",
  emoji:           "⚡",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/electrical",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/electrical",
  serviceLabel:    "Electrical Services",
  providerFormTitle: "Add Electrical Service",
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

const Electrical = () => <ServicePageLayout config={config} />;
export default Electrical;
