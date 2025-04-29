import React from "react";
import { Link } from "react-router-dom";
// Ensure you have a Footer component

const AboutUs = () => {
  return (
    <>
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
  
      <div style={styles.container}>
        <h1 style={styles.heading}>About Us</h1>
        <p style={styles.text}>
          Welcome to <strong>Pace Track</strong>, your trusted construction site management system. 
          Our platform is designed to streamline site operations, enhance communication, 
          and improve efficiency in construction projects.
        </p>

        <div style={styles.section}>
          <h2 style={styles.subHeading}>Our Mission</h2>
          <p style={styles.text}>
            Our mission is to simplify construction management through technology, 
            ensuring seamless coordination, accurate tracking, and real-time updates 
            for all stakeholders.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.subHeading}>Why Choose Us?</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>🚀 Efficient project tracking and reporting.</li>
            <li style={styles.listItem}>🤝 Seamless collaboration between teams.</li>
            <li style={styles.listItem}>📊 Real-time monitoring of site activities.</li>
            <li style={styles.listItem}>🔒 Secure and user-friendly interface.</li>
          </ul>
        </div>
      </div>
      {/* Footer */}
      <footer style={{ background: "#00103c", color: "white", textAlign: "center", padding: "15px", marginTop:"230px" }}>
        <p>© 2024 Pace Track. All rights reserved.</p>
      </footer>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "80%",
    margin: "130px auto",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  heading: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  subHeading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#444",
    marginTop: "30px",
  },
  text: {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#666",
    marginBottom: "20px",
  },
  section: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    fontSize: "18px",
    color: "#444",
    marginBottom: "10px",
    textAlign: "left",
    paddingLeft: "20px",
  },
};

export default AboutUs;
