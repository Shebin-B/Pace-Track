import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaBars, FaHome, FaUsers, FaProjectDiagram, FaClipboardList, 
  FaSignOutAlt, FaUserCircle, FaUserTie, FaClock , FaUserClock
} from "react-icons/fa";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, List } from "@mui/material";

const Managerassignedsites = () => {
  const { managerId } = useParams(); // ✅ Get logged-in Project Manager ID
  const navigate = useNavigate(); // ✅ Initialize navigation// Get logged-in Project Manager ID
  const [assignedSites, setAssignedSites] = useState([]);
  const [managerData, setManagerData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [employeesDialog, setEmployeesDialog] = useState(false);
  const [clientDialog, setClientDialog] = useState(false); // New state for client dialog
  const [employees, setEmployees] = useState([]);

  const menuItems = [
   { path: "/manager/dashboard", icon: <FaHome />, label: "Dashboard" },
       { 
         path: `/viewmanagerassignedsites/${managerId}`,  // ✅ Fix: Ensure dynamic navigation
         icon: <FaProjectDiagram />, 
         label: "My Sites",
         onClick: () => navigate(`/viewmanagerassignedsites/${managerId}`) // ✅ Ensures correct dynamic route
       },    { path: "/manager/reports", icon: <FaClipboardList />, label: "Reports" },
       { path: `/pm_attendance/${managerId}`, icon: <FaUserClock />, label: "Attendance" }, // ✅ Pass userId dynamically
       { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  // Fetch assigned sites
  const handleViewSites = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/api/siteregister/getManagerSites/${managerId}`);
      setAssignedSites(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching assigned sites:", error);
      setAssignedSites([]);
    }
  };

  // Fetch manager details
  // const fetchManagerDetails = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:5004/api/manager/${managerId}`);
  //     console.log("Manager Data:", response.data);  
  //     setManagerData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching manager details:", error);
  //   }
  // };

  const fetchEmployees = async (siteId) => {
    try {
      console.log("Fetching employees for siteId:", siteId);
      const response = await axios.get(`http://localhost:5004/api/siteregister/employees/${siteId}`);
      console.log("Employees API Response:", response.data); // Debugging log
      setEmployees(response.data || []);
      setEmployeesDialog(true); // Open employee dialog
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees.");
      setEmployees([]);
    }
  };

 const fetchClientDetails = async (clientId) => {
    try {
        console.log("Fetching client details for ID:", clientId);  // Log the ID
        const response = await axios.get(`http://localhost:5004/api/managers/clientdetails/${clientId}`);
        console.log("Client Data:", response.data);
        setClientDetails(response.data);
        setClientDialog(true); // Open client details dialog
    } catch (error) {
        console.error("Error fetching client details:", error);
        alert("Failed to fetch client details.");
    }
};


  useEffect(() => {
    if (managerId) {
      setLoading(true);
      // fetchManagerDetails();
      handleViewSites();
      setLoading(false);
    }
  }, [managerId]);

  const openClientDetails = (clientId) => {
    fetchClientDetails(clientId); // Fetch and show client details
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "white" }}>
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
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>

          {/* Profile Dropdown */}
          <div style={{ position: "relative" }}>
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
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle style={{ fontSize: "28px" }} />
              <span>{managerData?.name || "Manager"}</span>
            </button>
          </div>
        </div>

        {/* Assigned Sites List */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Assigned Sites</h2>

          {loading ? (
            <p>Loading sites...</p>
          ) : assignedSites.length > 0 ? (
            <ul style={{ listStyle: "none", padding: "0" }}>
              {assignedSites.map((site) => (
                <li
                  key={site._id}
                  style={{
                    backgroundColor: "#E3F2FD",
                    padding: "15px",
                    borderRadius: "10px",
                    marginBottom: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ textAlign: "left", flex: 1 }}>
                    <strong>Client:</strong> {site.client_Id?.name || "N/A"} <br />
                    <strong>Address:</strong> {site.site_address} <br />
                    <strong>Total Cost:</strong> ₹{site.total_cost} <br />
                    <strong>End Date:</strong> {new Date(site.end_date).toLocaleDateString()} <br />
                    <strong>Site Supervisor:</strong> {site.site_supervisor_Id?.name || "Not Assigned"} <br />
                  </div>

                  {/* Icons */}
                  <div style={{ display: "flex", gap: "30px", fontSize: "28px" }}>
                    <button onClick={() => openClientDetails(site.client_Id?._id)} style={{ color: "#007BFF", border: "none", background: "none" }}>
                      <FaUserTie title="View Client" />
                    </button>
                    <button onClick={() => fetchEmployees(site._id)} style={{ color: "#007BFF", border: "none", background: "none" }}>
                      <FaUsers title="View Employees" />
                    </button>

                   
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No sites assigned yet.</p>
          )}
        </div>

        {/* Employees Dialog */}
        <Dialog open={employeesDialog} onClose={() => setEmployeesDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Assigned Employees</DialogTitle>
          <DialogContent>
            <List>
              {employees.length > 0 ? (
                employees.map((empCategory, index) => (
                  <div key={index}>
                    <h6>{empCategory.category}</h6>
                    <ul>
                      {empCategory.employees.length > 0 ? (
                        empCategory.employees.map((emp) => (
                          <li key={emp._id}>{emp.name}</li> // Replace with emp.name if available
                        ))
                      ) : (
                        <p>No employees in this category.</p>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No employees assigned.</p>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEmployeesDialog(false)} variant="contained" color="secondary">Close</Button>
          </DialogActions>
        </Dialog>

        {/* Client Details Dialog */}
        <Dialog open={clientDialog} onClose={() => setClientDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Client Details</DialogTitle>
          <DialogContent>
            {clientDetails ? (
              <div>
                <p><strong>Name:</strong> {clientDetails.name}</p>
                <p><strong>Email:</strong> {clientDetails.email}</p>
                <p><strong>Phone:</strong> {clientDetails.phone}</p>
                <p><strong>Address:</strong> {clientDetails.address}</p>
              
              </div>
            ) : (
              <p>Loading client details...</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClientDialog(false)} variant="contained" color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Managerassignedsites;
