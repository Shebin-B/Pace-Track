import React from "react";
import { FaUserTie, FaProjectDiagram, FaMapMarkedAlt, FaUsers } from "react-icons/fa";
import "../styles/adminpage.css";
import NavigationBar from "./adminNavbar";
import { Link } from "react-router-dom";
import Footer from "./adminfooter";


const AdminPage = () => {
  return (
    <div>
      <NavigationBar />
      <div className="admin-container">
        {/* Main Content */}
        <div className="main-content">
          <header>
            <h1>Hello, Admin</h1>
            <p className="motive">
              Pace Track - Ensuring seamless project tracking & effective management.
            </p>
          </header>

          <div className="illustration-section">
          <img src="/assets/illu2.jpg" alt="Illustration" className="illustration" />
            <img src="/assets/ilu1.jpg" alt="Illustration" className="illustration" />
          </div>

         
          <div className="navigation-icons">
          <Link to="/client_page" className="nav-card" style={{ textDecoration: "none", color: "inherit" }}>
          <FaUserTie className="icon"  style={{ fontSize: "3rem", color: "#333" }}/>
     <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", margin: "0" }}>Clients</p>
     </Link>

     <Link to="/pm_page" className="nav-card" style={{ textDecoration: "none", color: "inherit" }}>
     <FaProjectDiagram className="icon"  style={{ fontSize: "3rem", color: "#333" }} />
     <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", margin: "0" }}>Project Managers</p>
     </Link>

     <Link to="/viewsite" className="nav-card" style={{ textDecoration: "none", color: "inherit" }}>
     <FaMapMarkedAlt className="icon"  style={{ fontSize: "3rem", color: "#333" }}/>
     <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", margin: "0" }}>Sites</p>
     </Link>

     


<Link to="/supervisor_viewpage" className="nav-card" style={{ textDecoration: "none", color: "inherit" }}>
    <FaUsers className="icon" style={{ fontSize: "3rem", color: "#333" }} />
    <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#333", margin: "0" }}>Supervisors</p>
</Link>
</div>

        </div>
      </div>
          {/* Footer Section */}
          <Footer />
    </div>
  );
};

export default AdminPage;
