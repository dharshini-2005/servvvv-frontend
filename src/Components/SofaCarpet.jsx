import React from "react";
import ServicePageLayout from "./ServicePageLayout";

const config = {
  title:           "Sofa & Carpet Cleaning",
  subtitle:        "Deep cleaning for sofas, carpets and upholstery using professional equipment.",
  heroImage:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop",
  emoji:           "🛋️",
  serviceEndpoint: "https://servease-backend-870h.onrender.com/api/services/sofa-carpet",
  bookingEndpoint: "https://servease-backend-870h.onrender.com/api/bookings/sofa-carpet",
  serviceLabel:    "Sofa & Carpet Services",
  providerFormTitle: "Add Sofa/Carpet Service",
  extraFields: [
    {
      name: "type",
      placeholder: "Select service type",
      type: "select",
      options: [
        { value: "sofa",   label: "Sofa Cleaning" },
        { value: "carpet", label: "Carpet Cleaning" },
      ],
    },
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

const SofaCarpet = () => <ServicePageLayout config={config} />;
export default SofaCarpet;
