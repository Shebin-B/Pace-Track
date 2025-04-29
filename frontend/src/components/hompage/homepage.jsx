import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTools, FaChartLine, FaUsers, FaQuoteLeft } from "react-icons/fa";
import { ReactTyped } from "react-typed";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Homepage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch("http://localhost:5004/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const stats = [
    { label: "Projects Completed", count: 250 },
    { label: "Active Clients", count: 180 },
    { label: "Total Workforce", count: 1200 },
  ];


  const testimonialSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f8f9fa", color: "#333" }}>
      {/* Navbar */}
<nav className="navbar navbar-expand-lg fixed-top"
     style={{
       background: "white",
       borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
       boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
       padding: "12px 20px",
     }}>
  <div className="container-fluid">
    <Link className="navbar-brand fw-bold" to="/" 
          style={{ fontSize: "26px", color: "black", textTransform: "uppercase", letterSpacing: "1px", transition: "color 0.3s ease-in-out" }}
          onMouseEnter={(e) => e.target.style.color = "#FFD700"}
          onMouseLeave={(e) => e.target.style.color = "black"}>
      Pace Track
    </Link>

    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
    <ul className="navbar-nav">
  {[
    { label: "Home", route: "/" },
    { label: "About", route: "/aboutus" },
    { label: "Contact Us", route: "/contactus" }, // Corrected route
    { label: "Login", route: "/login" },
  ].map(({ label, route }, index) => (
    <li className="nav-item" key={index}>
      <Link
        className="nav-link"
        to={route}
        style={{
          fontSize: "18px",
          fontWeight: "500",
          color: "black",
          padding: "10px 15px",
          transition: "all 0.3s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.target.style.color = "#FFD700";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.color = "black";
          e.target.style.transform = "scale(1)";
        }}
      >
        {label}
      </Link>
    </li>


        ))}

        {/* Register Dropdown */}
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="#" id="registerDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "black",
                  padding: "10px 15px",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#FFD700";
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "black";
                  e.target.style.transform = "scale(1)";
                }}>
            Register
          </Link>
          
          <ul className="dropdown-menu" aria-labelledby="registerDropdown"
              style={{
                background: "#00103c",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "5px",
                overflow: "hidden",
              }}>
            {[
              { name: "Client", path: "/client_reg" },
              { name: "Project Manager", path: "/pm_reg" },
              { name: "Site Supervisor", path: "/supervisor_reg" },
            ].map((item, index) => (
              <li key={index}>
                <Link className="dropdown-item" to={item.path}
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#ffffff",
                        padding: "10px 20px",
                        transition: "background 0.3s ease-in-out",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "rgba(255, 215, 0, 0.2)"}
                      onMouseLeave={(e) => e.target.style.background = "transparent"}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <section className="hero-section" style={{
    height: "100vh",
    background: `linear-gradient(to right, rgba(0, 16, 60, 0.42), rgba(0, 79, 158, 0.29)), url('/assets/home-1.jpg')`,
    backgroundSize: "cover",  // Ensures full coverage
    backgroundRepeat: "no-repeat",  // Prevents tiling
    backgroundPosition: "center center", // Keeps the image centered
     // Optional: Keeps the image fixed while scrolling
    width: "100vw", // Ensures it spans the full width
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white"
  }}>
        <div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "20px" }}>Build Smarter with <span style={{ color: "#FFD700" }}>
            <ReactTyped strings={["Pace Track", "Efficiency", "Tracking"]} typeSpeed={80} backSpeed={50} loop />
          </span></h1>
          <p style={{ fontSize: "1.5rem", maxWidth: "800px" }}>Track construction progress, manage workforce efficiently, and optimize projects in real time.</p>
          <a href="/login" className="btn btn-warning mt-3" role="button">Get Started</a>
          </div>
      </section>
      
      {/* Features Section */}
      <section className="features-section" style={{ padding: "60px 10%", textAlign: "center", background: "#f8f9fa" }}>
        <h2>Why Choose Pace Track?</h2>
        <div className="row">
          {[{ icon: <FaTools />, title: "Smart Project Tracking", desc: "Real-time updates and progress reports to keep your projects on schedule." },
            { icon: <FaChartLine />, title: "Performance Analytics", desc: "Data-driven insights to improve efficiency and optimize resources." },
            { icon: <FaUsers />, title: "Workforce Management", desc: "Monitor employee attendance, assign tasks, and track productivity." }]
            .map((feature, index) => (
              <div className="col-md-4" key={index} data-aos="fade-up">
                <div style={{ padding: "20px", borderRadius: "10px", background: "#fff", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
                  <div style={{ fontSize: "3rem", color: "#00103c", marginBottom: "10px" }}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" style={{ textAlign: "center", padding: "50px 10%", background: "linear-gradient(to right, rgb(5, 21, 63), rgb(45, 2, 2))" }}>
        <h2 style={{color:"white"}}>Our Achievements</h2>
        <div className="row" data-aos="fade-up">
          {stats.map((stat, index) => (
            <div className="col-md-4" key={index} style={{ padding: "20px", fontSize: "24px", fontWeight: "bold", color:"white"}}>
              <span style={{ fontSize: "3rem", color: "white" }}>{stat.count}+</span>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ textAlign: "center", padding: "50px 10%", background: "#fff" }}>
        <h2>What Our Users Say</h2>
        <Slider {...testimonialSettings}>
          {[{ quote: "Pace Track transformed the way we manage construction projects. Highly recommended!", name: "R Govind Krishnan, Project Manager" },
            { quote: "The best platform for real-time tracking and workforce management!", name: "Rose Marya Shibu, Site Supervisor" },
            { quote: "Pace Track has greatly improved our efficiency and communication on-site.", name: "Shebin B, Client" },
            { quote: "An intuitive and powerful tool that simplifies the complexities of project management.", name: "Sona Shaji, Project Manager" }
            ]
            .map((testimonial, index) => (
              <div key={index} style={{ padding: "20px" }}>
                <FaQuoteLeft style={{ fontSize: "2rem", color: "#ffcc00" }} />
                <p>"{testimonial.quote}"</p>
                <h4>- {testimonial.name}</h4>
              </div>
          ))}
        </Slider>
      </section>

     {/* Contact Section */}
<section
  style={{
    padding: "80px 10%",
    background: "linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(246, 246, 246, 0.8)), url('/assets/contact-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "1200px",
      display: "flex",
      gap: "50px",
      alignItems: "center",
      background: "rgba(29, 2, 98, 0.12)",
      padding: "40px",
      borderRadius: "10px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    }}
  >
    {/* Left Side - Get in Touch */}
    <div style={{ flex: "1", textAlign: "left" }}>
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "20px",
          fontWeight: "bold",
          color: "#00103c",
        }}
      >
        Get in Touch
      </h2>
      <p style={{ fontSize: "1.2rem", marginBottom: "20px", color: "#333" }}>
        Have questions or need assistance? Contact us, and we’ll get back to you soon!
      </p>
  
    </div>

    {/* Right Side - Contact Form */}
    <div style={{ flex: "1" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          required
          style={{
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
            resize: "none",
          }}
        ></textarea>

        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: "18px",
            fontWeight: "bold",
            background: "#FFD700",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#FFC107")}
          onMouseLeave={(e) => (e.target.style.background = "#FFD700")}
        >
          Send Message
        </button>
      </form>
    </div>
  </div>
</section>

      {/* Footer */}
      <footer style={{ background: "#00103c", color: "white", textAlign: "center", padding: "15px" }}>
        <p>© 2024 Pace Track. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
