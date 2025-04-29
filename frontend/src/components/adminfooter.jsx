import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      
      {/* Copyright */}
      <div style={styles.copyright}>
        <p>© 2025 Pace Track. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Inline Styles
const styles = {
  footer: {
    background: "linear-gradient(to right, #02022b, #410202)",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    
    position: "relative",
   
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1100px",
    margin: "0 auto",
    animation: "fadeIn 1s ease-in-out",
  },
  section: {
    flex: "1",
    minWidth: "250px",
    marginBottom: "20px",
    transition: "transform 0.3s ease-in-out",
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "2px solid #ff7b00",
    display: "inline-block",
    paddingBottom: "5px",
  },
  text: {
    fontSize: "0.9rem",
    color: "#bbb",
    lineHeight: "1.6",
  },
  list: {
    listStyle: "none",
    padding: "0",
  },
  link: {
    textDecoration: "none",
    color: "#ff7b00",
    fontSize: "0.95rem",
    display: "block",
    marginBottom: "5px",
    transition: "color 0.3s ease",
  },
  socialIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "12px",
  },
  icon: {
    fontSize: "1.7rem",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out, color 0.3s ease-in-out",
    color: "#ff7b00",
  },
  copyright: {
    borderTop: "#444",
    marginTop: "20px",
    paddingTop: "10px",
    fontSize: "0.85rem",
    color: "#aaa",
    animation: "slideUp 1s ease-in-out",
  },
};

// Adding hover effects using JavaScript
styles.link[":hover"] = { color: "#fff" };
styles.icon[":hover"] = { transform: "scale(1.2)", color: "#ff4500" };
styles.section[":hover"] = { transform: "translateY(-5px)" };

export default Footer;
