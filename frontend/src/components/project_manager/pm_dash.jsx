import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaUserCircle, FaBars, FaHome, FaProjectDiagram, FaClipboardList, FaSignOutAlt, FaUserClock } from "react-icons/fa";
import axios from "axios";



const ProjectManagerDashboard = () => {
  const { userId: paramUserId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const storedUserId = paramUserId || localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (!storedUserId) {
      console.error("User ID is missing. Redirecting to login.");
      navigate("/login");
    } else {
      setUserId(storedUserId);
      fetchManagerData(storedUserId);
    }
  }, []);

  const fetchManagerData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/managers/managerdetails/${id}`);
      setManagerData(response.data);
    } catch (error) {
      console.error("Error fetching project manager data:", error);
    }
  };

  // ✅ Define menuItems inside the component so it can access `userId`
  const menuItems = [
    { path: "/manager/dashboard", icon: <FaHome />, label: "Dashboard" },
    { 
      path: `/viewmanagerassignedsites/${userId}`,  // ✅ Fix: Ensure dynamic navigation
      icon: <FaProjectDiagram />, 
      label: "My Sites",
      onClick: () => navigate(`/viewmanagerassignedsites/${userId}`) // ✅ Ensures correct dynamic route
    },    { path: "/manager/reports", icon: <FaClipboardList />, label: "Reports" },
    { path: `/pm_attendance/${userId}`, icon: <FaUserClock />, label: "Attendance" }, // ✅ Pass userId dynamically
    { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
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
        {sidebarOpen && <h2 style={{ fontSize: "22px", fontWeight: "bold", textAlign: "center" }}>Project Manager Panel</h2>}
        <ul style={{ listStyle: "none", padding: "0" }}>
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

          {/* Profile Section */}
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
            <span>{managerData?.name || "Manager"}</span>
          </button>
        </div>

        {/* Dashboard Content */}
        <div style={{ marginTop: "170px", padding: "20px", textAlign: "center", color: "white" }}>
          <h2 style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>
            Hi, {managerData?.name || "Manager"}!
          </h2>
          <p style={{ fontSize: "25px", fontWeight: "500", maxWidth: "600px", margin: "0 auto" }}>
            Welcome to <strong>Pace Track</strong>, your project management solution to track progress, reports, and updates.
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
            onClick={() => navigate(`/viewmanagerassignedsites/${userId}`)}
          >
            View My Sites
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
