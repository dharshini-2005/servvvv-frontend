import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Painting Services",
  subtitle:        "Interior and exterior painting by skilled professionals.",
  heroImage:       "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1400&auto=format&fit=crop",
  emoji:           "🎨",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/painting",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/painting",
  serviceLabel:    "Painting Services",
  providerFormTitle: "Add Painting Service",
  extraFields: [
    { name: "paintType", placeholder: "Paint type (Interior, Exterior, Texture)" },
  ],
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

const Painting = () => <ServicePageLayout config={config} />;
export default Painting;
