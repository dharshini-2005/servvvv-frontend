import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Cockroach, Ant & Pest Control",
  subtitle:        "Effective pest control solutions to keep your home safe and clean.",
  heroImage:       "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=1400&auto=format&fit=crop",
  emoji:           "🐜",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/cockroach-ant-pest",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/cockroach-ant-pest",
  serviceLabel:    "Pest Control Services",
  providerFormTitle: "Add Pest Control Service",
  extraFields: [
    { name: "serviceType",  placeholder: "Pest type (cockroach, ant, general)" },
    { name: "areaCoverage", placeholder: "Area coverage (e.g. 1000 sq ft)" },
  ],
  bookingPayload: (cart, user, address) => ({
    serviceId:           cart[0]._id,
    customerEmail:       user.email,
    providerEmail:       cart[0].providerEmail,
    bookingDate:         new Date().toISOString(),
    address:             address || "Address to be provided",
    totalAmount:         cart.reduce((s, i) => s + Number(i.price), 0),
    specialInstructions: "Pest control booking",
  }),
};

const CockroachAntPestControl = () => <ServicePageLayout config={config} />;
export default CockroachAntPestControl;
