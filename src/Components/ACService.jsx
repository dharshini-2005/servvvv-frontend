import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "AC Service & Repair",
  subtitle:        "Professional AC installation, repair and maintenance at your doorstep.",
  heroImage:       "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1400&auto=format&fit=crop",
  emoji:           "❄️",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/ac",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/ac",
  serviceLabel:    "AC Services",
  providerFormTitle: "Add AC Service",
};

const ACService = () => <ServicePageLayout config={config} />;
export default ACService;
