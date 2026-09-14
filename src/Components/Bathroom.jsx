import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Bathroom Cleaning",
  subtitle:        "Deep cleaning and sanitisation for spotless bathrooms.",
  heroImage:       "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&auto=format&fit=crop",
  emoji:           "🚿",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/bathroom",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/bathroom",
  serviceLabel:    "Bathroom Services",
  providerFormTitle: "Add Bathroom Service",
};

const Bathroom = () => <ServicePageLayout config={config} />;
export default Bathroom;
