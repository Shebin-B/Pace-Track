import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavBar = () => {
  const [activeLink, setActiveLink] = useState("");

  return (
    <Navbar
      expand="lg"
      className="py-lg-4 py-3"
      style={{ background: "linear-gradient(to right, #02022b, #410202)", paddingTop: "15px", paddingBottom: "15px" }}
    >
      <Container fluid className="px-lg-5 px-3">
        {/* Project Name */}
        <Navbar.Brand
          href="/"
          className="fw-bold text-white"
          style={{
            fontSize: "2rem",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            paddingBottom: "5px"
          }}
        >
          Pace Track
        </Navbar.Brand>

        {/* Toggle Button for Small Screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="ms-auto d-flex align-items-center"
            style={{ gap: "20px", padding: "10px 15px" }} // Reduced gap
          >
            {[
              { name: "Dashboard", link: "/adminpage", hoverColor: "#00D4FF" },   // Cyan
              { name: "Clients", link: "/client_page", hoverColor: "#8E44AD" },  // Purple
              { name: "Managers", link: "/pm_page", hoverColor: "#FFB400" },  // Green
              { name: "Supervisors", link: "/supervisor_viewpage", hoverColor: "#27AE60" },  // Green

              { name: "Employees", link: "/view_emp", hoverColor: "#3498DB" },  // Blue
            ].map((item, index) => (
              <Nav.Link
                key={index}
                href={item.link}
                className={`text-white fw-bold px-3 py-2 rounded ${
                  activeLink === item.link ? "active-link" : ""
                }`}
                style={{
                  fontSize: "1.2rem",
                  transition: "0.3s",
                  borderBottom: activeLink === item.link ? `3px solid ${item.hoverColor}` : "3px solid transparent",
                  paddingBottom: "8px" // Adjusting vertical alignment
                }}
                onMouseEnter={(e) => (e.target.style.borderBottom = `3px solid ${item.hoverColor}`)}
                onMouseLeave={(e) => (e.target.style.borderBottom = activeLink === item.link ? `3px solid ${item.hoverColor}` : "3px solid transparent")}
                onClick={() => setActiveLink(item.link)}
              >
                {item.name}
              </Nav.Link>
            ))}

            {/* Logout Button */}
            <Nav.Link
              href="/logout"
              className="fw-bold px-4 py-2 rounded"
              style={{
                fontSize: "1.2rem",
                backgroundColor: "#C70039",
                color: "white",
                transition: "0.3s",
                boxShadow: "0 5px 10px rgba(199, 0, 57, 0.5)",
                paddingBottom: "8px" // Adjusting vertical alignment
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FF3B5A")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#C70039")}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
