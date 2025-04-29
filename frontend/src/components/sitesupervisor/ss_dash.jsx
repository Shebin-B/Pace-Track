import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaUserCircle, FaBars, FaHome, FaProjectDiagram, FaSignOutAlt, FaUserClock, FaFileAlt } from "react-icons/fa";
import axios from "axios";

const SiteSupervisorDashboard = () => {
  const { userId: paramUserId } = useParams();
  const [userId, setUserId] = useState(null);
  const [supervisorData, setSupervisorData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Initialize navigation  

  useEffect(() => {
    const storedUserId = paramUserId || localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID is missing. Redirecting to login.");
      navigate("/login");
    } else {
      setUserId(storedUserId);
      fetchSupervisorData(storedUserId);
    }
  }, [paramUserId, navigate]);

  const fetchSupervisorData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/supervisors/supervisordetails/${id}`);
      setSupervisorData(response.data);
    } catch (error) {
      console.error("Error fetching site supervisor data:", error);
    }
  };

  // ✅ Move menuItems inside the component to access `navigate` and `userId`
  const menuItems = [
    { path: "/supervisor/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: `/attendence_dash/${userId}`, icon: <FaUserClock />, label: "Mark Attendance" },
    { 
      label: "Assigned Sites", 
      icon: <FaProjectDiagram />, 
      onClick: () => navigate(`/ss_assignedsites/${userId}`) // ✅ Fixed navigation
    },
    { path: "/supervisor/reports", icon: <FaFileAlt />, label: "Reports" },
    { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "linear-gradient(to right, rgb(0, 16, 60), rgb(42, 0, 0))" }}>
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "18rem" : "0px",
          background: "linear-gradient(to right, rgb(0, 16, 60), rgb(0, 0, 0))",
          color: "white",
          padding: sidebarOpen ? "50px 20px" : "0px",
          transition: "width 0.5s ease-in-out, padding 0.5s ease-in-out",
          boxShadow: sidebarOpen ? "4px 0 12px rgba(0, 0, 0, 0.3)" : "none",
          overflow: "hidden",
          height: "100vh",
          position: "relative",
        }}
      >
        {sidebarOpen && <h2 style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center" }}>Site Supervisor Panel</h2>}
        <ul style={{ listStyle: "none", padding: "0" }}>
          {menuItems.map(({ path, icon, label, onClick }) => (
            <li key={path || label} style={{ margin: "10px 0" }}>
              {path ? (
                <Link
                  to={path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "20px",
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
              ) : (
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "15px",
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    fontSize: "20px",
                    fontWeight: "500",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                  }}
                  onClick={onClick}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")}
                >
                  {icon} {sidebarOpen && label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(to right, rgb(0, 16, 60), rgb(56, 1, 1))",
            padding: "15px 30px",
            boxShadow: "0px 4px 6px rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              color: "white",
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Dashboard</h1>

          {/* Dropdown Profile Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                <FaUserCircle style={{ fontSize: "28px" }} />
                <span>{supervisorData?.name || "Supervisor"}</span>
              </button>
            </DropdownMenu.Trigger>
          </DropdownMenu.Root>
        </div>

        {/* Dashboard Content */}
        <div style={{ marginTop: "170px", padding: "20px", textAlign: "center", color: "white" }}>
          <h2 style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
            Hi, {supervisorData?.name || "Supervisor"}!
            <p style={{ fontSize: "25px", fontWeight: "500", maxWidth: "600px", margin: "0 auto" }}>
            Welcome to <strong>Pace Track</strong>, your site management platform to handle tasks, reports, and attendance.
          </p>
          <button 
            style={{
              marginTop: "150px",
              padding: "12px 24px",
              fontSize: "20px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onClick={() => navigate(`/ss_assignedsites/${userId}`)}
          >
            View Assigned sites
          </button>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SiteSupervisorDashboard;
