import { Link } from "react-router-dom";

const ContactUs = () => {
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
        e.target.reset();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

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
      marginTop: "257px",
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
      <footer style={{ background: "#00103c", color: "white", textAlign: "center", padding: "15px", marginTop:"208px" }}>
        <p>© 2024 Pace Track. All rights reserved.</p>
      </footer>
    </>
  );
};

export default ContactUs;