import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaUserCircle, FaBars, FaHome, FaProjectDiagram, FaUserClock, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const ClientDashboard = () => {
  const { userId: paramUserId } = useParams(); // ✅ Get userId from route params
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedUserId = paramUserId || localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID is missing. Redirecting to login.");
      navigate("/login");
    } else {
      setUserId(storedUserId);
      fetchClientData(storedUserId);
    }
  }, []);

  const fetchClientData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/clients/clientdetails/${id}`);
      setClientData(response.data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "linear-gradient(to right, rgb(0, 16, 60), rgb(42, 0, 0))" }}>
      
      {/* Sidebar */}
      {/* Sidebar */}
<div
  style={{
    width: sidebarOpen ? "18rem" : "5rem",
    background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.1))",
    color: "white",
    padding: sidebarOpen ? "30px 20px" : "10px", // ✅ Adjusted padding
    transition: "width 0.5s ease-in-out, padding 0.5s ease-in-out",
    boxShadow: sidebarOpen ? "6px 0 15px rgba(0, 0, 0, 0.3)" : "none",
    overflow: "hidden",
    height: "100vh",
    backdropFilter: "blur(12px)",
    borderRight: "2px solid rgba(255, 255, 255, 0.15)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // ✅ Keeps elements properly aligned
    gap: "5px" // ✅ Added small gap for structure
  }}
>
  {/* Sidebar Header */}
  {sidebarOpen && (
    <div
      style={{
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold",
        paddingBottom: "8px",
        borderBottom: "2px solid rgba(255, 255, 255, 0.2)", // Subtle divider
        textTransform: "uppercase",
        letterSpacing: "1px",
        textShadow: "1px 1px 5px rgba(255, 255, 255, 0.2)", // Soft glow effect
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px" // ✅ Space below heading
      }}
    >
      Client Panel
    </div>
  )}

  {/* ✅ Sidebar Menu Items (Only render when `userId` is available) */}
  {userId && (
    <ul style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", flexDirection: "column", gap: "15px" }}> 
      {[
        { path: `/client/dashboard/${userId}`, icon: <FaHome />, label: "Dashboard" },
        { path: `/viewmysites/${userId}`, icon: <FaProjectDiagram />, label: "My Sites" },
        { path: `/client_attendance/${userId}`, icon: <FaUserClock />, label: "View Attendance" },
        { path: `/client/profile/${userId}`, icon: <FaUserCircle />, label: "Profile" },
        { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" }
      ].map(({ path, icon, label }) => (
        <li key={path} style={{ margin: "0px" }}> {/* ✅ No unnecessary margin */}
          <Link
            to={path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transition: "background 0.3s, transform 0.2s",
              justifyContent: sidebarOpen ? "flex-start" : "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {icon} {sidebarOpen && label}
          </Link>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 30px", background: "linear-gradient(to right, rgb(0, 16, 60), rgb(56, 1, 1))" }}>
          {/* ✅ Hamburger button */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={{ background: "none", border: "none", fontSize: "22px", color: "white", cursor: "pointer" }}>
            <FaBars />
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button 
                style={{ 
                  display: "flex", alignItems: "center", gap: "10px", 
                  background: "none", border: "none", cursor: "pointer", 
                  fontSize: "18px", fontWeight: "bold", color: "white" , marginRight:"33px"
                }}
              >
                <FaUserCircle style={{ fontSize: "28px" }} />
                <span>{clientData?.name || "Client"}</span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content 
              align="end"
              sideOffset={10}
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                minWidth: "160px"
              }}
            >
              {/* Profile Option */}
              <DropdownMenu.Item asChild>
                <Link to={`/client/profile/${userId}`} style={dropdownItemStyle}>
                  <FaUserCircle style={{ fontSize: "20px" }} /> Profile
                </Link>
              </DropdownMenu.Item>

              {/* Logout Option */}
              <DropdownMenu.Item asChild>
                <Link to="/logout" style={{ ...dropdownItemStyle, color: "#ff4d4d" }}>
                  <FaSignOutAlt style={{ fontSize: "20px" }} /> Logout
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>

        {/* Dashboard Content */}
        <div style={{ 
  marginTop: "120px", 
  padding: "40px", 
  textAlign: "center", 
  color: "white", 
  display: "flex", 
  flexDirection: "column", 
  alignItems: "center", 
  justifyContent: "center"
}}>
  
  {/* Greeting */}
  <h2 style={{ 
    fontSize: "48px", 
    fontWeight: "bold", 
    marginBottom: "15px", 
    textShadow: "2px 2px 8px rgba(255, 255, 255, 0.2)" 
  }}>
    Hi, {clientData?.name || "Client"}!
  </h2>

  {/* Description */}
  <p style={{ 
    fontSize: "24px", 
    fontWeight: "500", 
    maxWidth: "750px", 
    lineHeight: "1.6", 
    textAlign: "center", 
    marginBottom: "40px",
    background: "rgba(255, 255, 255, 0.11)", 
    padding: "15px 20px", 
    borderRadius: "10px", 
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0)"
  }}>
    Welcome to <strong>Pace Track</strong> <p>Ensuring seamless project tracking & effective management.
    </p>
  </p>

  {/* CTA Button */}
  <button 
    style={{ 
      marginTop: "20px", 
      padding: "15px 30px", 
      fontSize: "22px", 
      fontWeight: "bold", 
      background: "linear-gradient(135deg, #007bff, #0056b3)", 
      color: "white", 
      border: "none", 
      borderRadius: "8px", 
      cursor: "pointer", 
      transition: "transform 0.2s ease-in-out, background 0.3s"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    onClick={() => navigate(`/viewmysites/${userId}`)}
  >
    View My Sites
  </button>

</div>

      </div>
    </div>
  );
};

const dropdownItemStyle = {
  display: "flex", alignItems: "center", gap: "10px",
  padding: "10px", color: "white", textDecoration: "none",
  transition: "background 0.3s", borderRadius: "6px"
};

export default ClientDashboard;
