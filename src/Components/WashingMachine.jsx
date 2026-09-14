import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Washing Machine Repair",
  subtitle:        "Expert repairs and maintenance for all washing machine brands.",
  heroImage:       "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1400&auto=format&fit=crop",
  emoji:           "🌀",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/washing-machine",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/washing-machine",
  serviceLabel:    "Washing Machine Services",
  providerFormTitle: "Add Washing Machine Service",
  bookingPayload: (cart, user, address) => ({
    serviceId:    cart[0]._id,
    customerEmail: user.email,
    providerEmail: cart[0].providerEmail,
    bookingDate:   new Date().toISOString(),
    address:       address || "Address to be provided",
    totalAmount:   cart.reduce((s, i) => s + Number(i.price), 0),
    specialInstructions: cart.length > 1 ? "Multiple services booked" : "",
  }),
};

const WashingMachine = () => <ServicePageLayout config={config} />;
export default WashingMachine;
