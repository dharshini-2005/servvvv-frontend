import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Television Service & Repair",
  subtitle:        "Installation, repair and maintenance for all TV brands and sizes.",
  heroImage:       "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=1400&auto=format&fit=crop",
  emoji:           "📺",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/television",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/television",
  serviceLabel:    "TV Services",
  providerFormTitle: "Add Television Service",
  extraFields: [
    { name: "serviceType", placeholder: "TV Type (LED, LCD, OLED, Plasma)" },
    { name: "screenSize",  placeholder: "Screen Size (e.g. 55 inch, 32 inch)" },
  ],
  bookingPayload: (cart, user, address) => ({
    serviceId:           cart[0]._id,
    customerEmail:       user.email,
    providerEmail:       cart[0].providerEmail,
    bookingDate:         new Date().toISOString(),
    address:             address || "Address to be provided",
    totalAmount:         cart.reduce((s, i) => s + Number(i.price), 0),
    specialInstructions: "Television service booking",
  }),
};

const Television = () => <ServicePageLayout config={config} />;
export default Television;
