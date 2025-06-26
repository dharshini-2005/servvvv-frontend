import React from "react";
import "../Styles/ContactModal.css";

const DUMMY_CONTACTS = {
  email: "support@servease.com",
  whatsapp: "+1 234 567 8900",
  instagram: "https://instagram.com/servease_demo",
  facebook: "https://facebook.com/servease_demo",
  twitter: "https://twitter.com/servease_demo"
};

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="contact-modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div><strong>Email:</strong> <a href={`mailto:${DUMMY_CONTACTS.email}`}>{DUMMY_CONTACTS.email}</a></div>
          <div><strong>WhatsApp:</strong> <a href="https://wa.me/12345678900" target="_blank" rel="noopener noreferrer">{DUMMY_CONTACTS.whatsapp}</a></div>
          <div><strong>Instagram:</strong> <a href={DUMMY_CONTACTS.instagram} target="_blank" rel="noopener noreferrer">@servease_demo</a></div>
          <div><strong>Facebook:</strong> <a href={DUMMY_CONTACTS.facebook} target="_blank" rel="noopener noreferrer">@servease_demo</a></div>
          <div><strong>Twitter:</strong> <a href={DUMMY_CONTACTS.twitter} target="_blank" rel="noopener noreferrer">@servease_demo</a></div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal; 