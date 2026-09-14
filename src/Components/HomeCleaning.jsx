import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Full Home Cleaning",
  subtitle:        "Thorough, professional cleaning for every corner of your home.",
  heroImage:       "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&auto=format&fit=crop",
  emoji:           "🏠",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/home-cleaning",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/home-cleaning",
  serviceLabel:    "Cleaning Services",
  providerFormTitle: "Add Home Cleaning Service",
  bookingPayload: (cart, user, address) => ({
    serviceId:           cart[0]._id,
    customerEmail:       user.email,
    providerEmail:       cart[0].providerEmail,
    bookingDate:         new Date().toISOString(),
    address:             address || "Address to be provided",
    totalAmount:         cart.reduce((s, i) => s + Number(i.price), 0),
    specialInstructions: cart.length > 1
      ? `Also includes: ${cart.slice(1).map(i => i.name).join(", ")}`
      : "",
  }),
};

const HomeCleaning = () => <ServicePageLayout config={config} />;
export default HomeCleaning;
