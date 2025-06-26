import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';

import Navbar from "./Components/Navbar";
import HeroSection from "./Components/HeroSection";
import ServiceCategories from "./Components/ServiceCategories";
import Footer from "./Components/Footer";
import HomeCleaning from "./Components/HomeCleaning";
import SofaCarpet from "./Components/SofaCarpet";  
import CockroachAntPestControl from "./Components/CockroachAntPestControl"; 
import ACService from "./Components/ACService";
import Bathroom from "./Components/Bathroom";
import WashingMachine from "./Components/Washingmachine";
// import Geyser from "./Components/Geyser";
import Plumbing from "./Components/Plumbing";
import Carpentry from "./Components/Carpentry";
import Electrical from "./Components/Electrical";
import Painting from "./Components/Painting";
import Headtrack from "./Components/Headtrack";
import HeadControlCursor from "./Components/HeadControlCursor";
import HeadCursor from "./Components/HeadCursor";
import HandCursor from "./Components/HandCursor";
import EyeCursor from "./Components/EyeCursor";
import Chatbot from "./Components/Chatbot";
import TrendingNews from "./Components/TrendingNews";
import Login from "./Components/Login";
import About from "./Components/About";
import Television from "./Components/Television";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HeroSection />
                <ServiceCategories />
                <Chatbot />
                <TrendingNews />
                <Footer />
              </>
            }
          />
          <Route path="/fullhome-cleaning" element={<HomeCleaning />} />
          <Route path="/sofa-carpet-cleaning" element={<SofaCarpet />} />
          <Route path="/cockroach-ant-pest-control" element={<CockroachAntPestControl />} />
          <Route path="/ac-service" element={<ACService />} />
          <Route path="/bathroom-cleaning" element={<Bathroom />} />
          <Route path="/washing-machine" element={<WashingMachine />} />
          {/* <Route path="/geyser" element={<Geyser />} /> */}
          <Route path="/plumbing" element={<Plumbing />} />
          <Route path="/carpentry" element={<Carpentry />} />
          <Route path="/electrical" element={<Electrical />} />
          <Route path="/painting" element={<Painting />} />
          <Route path="/television" element={<Television />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
