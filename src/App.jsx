import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

import Navbar              from "./Components/Navbar";
import HeroSection         from "./Components/HeroSection";
import ServiceCategories   from "./Components/ServiceCategories";
import Footer              from "./Components/Footer";
import Chatbot             from "./Components/Chatbot";

import Login               from "./Components/Login";
import About               from "./Components/About";

import HomeCleaning        from "./Components/HomeCleaning";
import SofaCarpet          from "./Components/SofaCarpet";
import CockroachAntPestControl from "./Components/CockroachAntPestControl";
import ACService           from "./Components/ACService";
import Bathroom            from "./Components/Bathroom";
import WashingMachine      from "./Components/WashingMachine";
import Plumbing            from "./Components/Plumbing";
import Carpentry           from "./Components/Carpentry";
import Electrical          from "./Components/Electrical";
import Painting            from "./Components/Painting";
import Television          from "./Components/Television";
import Checkout            from "./Components/Checkout";
import MyBookings          from "./Components/MyBookings";

/* Geyser component exists but the route is disabled until the
   backend service/booking routes are wired up for it. */

const HomePage = () => (
  <>
    <Navbar />
    <HeroSection />
    <ServiceCategories />
    <Chatbot />
    <Footer />
  </>
);

const App = () => (
  <AuthProvider>
    <Router>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} />
      <Routes>
        {/* Public pages */}
        <Route path="/"       element={<HomePage />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/about"  element={<About />} />

        {/* Cleaning & Pest Control */}
        <Route path="/fullhome-cleaning"          element={<HomeCleaning />} />
        <Route path="/sofa-carpet-cleaning"       element={<SofaCarpet />} />
        <Route path="/cockroach-ant-pest-control" element={<CockroachAntPestControl />} />
        <Route path="/bathroom-cleaning"          element={<Bathroom />} />

        {/* Appliance Service & Repair */}
        <Route path="/ac-service"      element={<ACService />} />
        <Route path="/washing-machine" element={<WashingMachine />} />
        <Route path="/television"      element={<Television />} />
        {/* /geyser — disabled: add <Route path="/geyser" element={<Geyser />} /> when ready */}

        {/* Quick Home Repairs */}
        <Route path="/plumbing"   element={<Plumbing />} />
        <Route path="/carpentry"  element={<Carpentry />} />
        <Route path="/electrical" element={<Electrical />} />
        <Route path="/painting"   element={<Painting />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
