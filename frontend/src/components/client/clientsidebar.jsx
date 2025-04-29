import { Link } from "react-router-dom";
import { FaBars, FaHome, FaProjectDiagram, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <div style={{
      width: sidebarOpen ? "18rem" : "4rem",
      height: "100vh",
      background: "linear-gradient(to right, rgb(0, 16, 60), rgb(0, 0, 0))",
      color: "white",
      transition: "width 0.5s ease-in-out, padding 0.3s ease-in-out",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      padding: sidebarOpen ? "50px 20px" : "0px",
      boxShadow: sidebarOpen ? "4px 0 12px rgba(0, 0, 0, 0.3)" : "none",
      position: "relative",
    }}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          background: "none",
          border: "none",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
          padding: "10px",
          textAlign: "center"
        }}
      >
        <FaBars />
      </button>

      {/* Sidebar Menu */}
      <ul style={{ listStyle: "none", padding: "0", marginTop: "20px" }}>
        {menuItems.map(({ path, icon, label }) => (
          <li key={path} style={{ margin: "10px 0" }}>
            <Link
              to={path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "500",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "10px",
                transition: "all 0.3s ease-in-out",
                width: "100%",
                justifyContent: sidebarOpen ? "flex-start" : "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")}
            >
              {icon} {sidebarOpen && label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Sidebar Menu Items
const menuItems = [
  { path: "/client/dashboard", icon: <FaHome />, label: "Dashboard" },
  { path: "/client/sites", icon: <FaProjectDiagram />, label: "My Sites" },
  { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
];

export default Sidebar;
