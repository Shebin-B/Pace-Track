import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const NavigationBar = () => {
  return (
    <Navbar 
      expand="lg" 
      className="py-lg-4 py-3"
      style={{ background: "linear-gradient(to right, #02022b, #410202)" }}

    >
      
      <Container fluid className="px-lg-5 px-3">
        
        {/* Project Name */}
        <Navbar.Brand 
          href="/" 
          className="fw-bold text-white"
          style={{ 
            fontSize: "2rem",
            textShadow: "2px 2px 5px rgba(0,0,0,0.3)"
          }} 
        >
          Pace Track
        </Navbar.Brand>

        {/* Toggle Button for Small Screens */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />

        <Navbar.Collapse id="basic-navbar-nav">
  <Nav
    className="ms-auto d-flex align-items-center"
    style={{ gap: "30px", padding: "10px 20px" }} // More spacing added
  >
    <Nav.Link
      href="/adminpage"
      className="text-white fw-bold px-4 py-2 rounded"
      style={{
        fontSize: "1.3rem",
        transition: "0.3s",
        borderBottom: "3px solid transparent",
      }}
      onMouseEnter={(e) => (e.target.style.borderBottom = "3px solid #00D4FF")}
      onMouseLeave={(e) => (e.target.style.borderBottom = "3px solid transparent")}
    >
      Dashboard
    </Nav.Link>

    <Nav.Link
      href="/view_emp"
      className="text-white fw-bold px-4 py-2 rounded"
      style={{
        fontSize: "1.3rem",
        transition: "0.3s",
        borderBottom: "3px solid transparent",
      }}
      onMouseEnter={(e) => (e.target.style.borderBottom = "3px solid #FFB400")}
      onMouseLeave={(e) => (e.target.style.borderBottom = "3px solid transparent")}
    >
      Employees
    </Nav.Link>

    <Nav.Link
      href="/emp_register"
      className="text-white fw-bold px-4 py-2 rounded"
      style={{
        fontSize: "1.3rem",
        transition: "0.3s",
        borderBottom: "3px solid transparent",
      }}
      
      onMouseEnter={(e) => (e.target.style.borderBottom = "3px solid #00D4FF")}
      onMouseLeave={(e) => (e.target.style.borderBottom = "3px solid transparent")}
    >
      Employee Registration
    </Nav.Link>

  


    <Nav.Link
      href="/logout"
      className="fw-bold px-4 py-2 rounded"
      style={{
        fontSize: "1.3rem",
        backgroundColor: "#C70039",
        color: "white",
        transition: "0.3s",
        boxShadow: "0 5px 10px rgba(199, 0, 57, 0.5)",
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

export default NavigationBar;
