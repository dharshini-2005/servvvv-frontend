import React from "react";
import Slider from "react-slick"; // Import Slider from react-slick
import "../Styles/HeroSection.css";
import "slick-carousel/slick/slick.css"; // Import slick carousel styles
import "slick-carousel/slick/slick-theme.css"; 

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1, // Show only 1 image at a time
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Auto-slide every 2 seconds
    arrows: true, // Adds navigation arrows
  };

  return (
    <div className="hero-section">
      <div className="hero-text">
        <h1 className="title">Home services</h1>
        <h1 className="title-2">at your doorstep</h1>
        <div className="rating">
          <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_48,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693570188661-dba2e7.jpeg" alt="Service Rating"/>
          <div className="rating-item">
            <b>4.8</b>
            <span>Service Rating</span>
          </div>
          <img src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template,q_auto:low,f_auto/w_48,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1693491890812-e86755.jpeg" alt="Customers"/>
          <div className="rating-item">
            <b>12M+</b>
            <span>Customer Globally</span>
          </div>
        </div>
      </div>

      <div className="image">
        <Slider {...settings} className="image-slider">
          <div><img src="https://konnectrealty.com/images/clients/21a.png" alt="Slide 1" /></div>
          <div><img src="https://media.istockphoto.com/id/1457385092/photo/an-asian-young-technician-service-man-wearing-blue-uniform-checking-cleaning-air-conditioner.jpg?s=612x612&w=0&k=20&c=Tqu5jMzD1TKFO1Fvow6d0JMDsEGU8T3kToP706bQFQI=" alt="Slide 2" /></div>
          <div><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRflhAmtbZlMacfyZ8t_c6Qs6xlWfAjRxNXQA&s" alt="Slide 3" /></div>
          <div><img src="https://media.istockphoto.com/id/1457385092/photo/an-asian-young-technician-service-man-wearing-blue-uniform-checking-cleaning-air-conditioner.jpg?s=612x612&w=0&k=20&c=Tqu5jMzD1TKFO1Fvow6d0JMDsEGU8T3kToP706bQFQI=" alt="Slide 4" /></div>
          <div><img src="https://konnectrealty.com/images/clients/21a.png" alt="Slide 5" /></div>
        </Slider>
      </div>
    </div>
  );
};

export default HeroSection;
