import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaBars, FaHome, FaUsers, FaProjectDiagram, FaClipboardList, 
  FaSignOutAlt, FaUserCircle, FaUserTie, FaClock
} from "react-icons/fa";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, List } from "@mui/material";

const SupervisorAssignedSites = () => {
  const { supervisorId } = useParams(); // ✅ Getting Supervisor ID from URL
  const navigate = useNavigate(); // ✅ Initialize navigation
  const [assignedSites, setAssignedSites] = useState([]);
  const [supervisorData, setSupervisorData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);
  const [clientDialog, setClientDialog] = useState(false);
  const [employeesDialog, setEmployeesDialog] = useState(false);
  const [employees, setEmployees] = useState([]);

  // ✅ Define Menu Items (Fixed `userId` issue)
  const menuItems = [
    { path: "/supervisor/dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: `/attendence_dash/${supervisorId}`, icon: <FaClock />, label: "Mark Attendance" },
    { 
      label: "Assigned Sites", 
      icon: <FaProjectDiagram />,
      onClick: () => navigate(`/ss_assignedsites/${supervisorId}`) // ✅ Pass supervisorId correctly
    },  
    { path: "/supervisor/reports", icon: <FaClipboardList />, label: "Reports" }, // ✅ Fixed path
    { path: "/logout", icon: <FaSignOutAlt />, label: "Logout" },
  ];

  useEffect(() => {
    if (supervisorId) {
      setLoading(true);
      fetchSupervisorDetails();
      handleViewSites();
      setLoading(false);
    }
  }, [supervisorId]);

  const fetchSupervisorDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/api/supervisors/supervisordetails/${supervisorId}`);
      console.log("Supervisor Data:", response.data);
      setSupervisorData(response.data);
    } catch (error) {
      console.error("Error fetching supervisor details:", error);
    }
  };

  const handleViewSites = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/api/supervisors/getSupervisorSites/${supervisorId}`);
      setAssignedSites(Array.isArray(response.data) ? response.data : []);

    } catch (error) {
      console.error("Error fetching assigned sites:", error);
      setAssignedSites([]);
    }
  };

  const fetchEmployees = async (siteId) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/siteregister/employees/${siteId}`);
      setEmployees(response.data || []);
      setEmployeesDialog(true);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("Failed to fetch employees.");
      setEmployees([]);
    }
  };

  const fetchClientDetails = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:5004/api/supervisors/clientdetails/${clientId}`);
      setClientDetails(response.data);
      setClientDialog(true);
    } catch (error) {
      console.error("Error fetching client details:", error);
      alert("Failed to fetch client details.");
    }
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
  {sidebarOpen && (
    <h2
      style={{
        fontSize: "22px",
        fontWeight: "bold",
        textAlign: "center",
        whiteSpace: "nowrap", // ✅ Prevents text from wrapping
      }}
    >
      Panel
    </h2>
  )}

  <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
    {menuItems.map(({ path, icon, label }) => (
      <li key={path} style={{ margin: "10px 0", width: "100%" }}>
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
            whiteSpace: "nowrap", // ✅ Prevents text from breaking
            display: "flex",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")
          }
        >
          {icon}
          <span style={{ display: sidebarOpen ? "inline" : "none" }}>{label}</span>
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
              <span>{supervisorData?.name || "Manager"}</span>
            </button>
          </div>
        </div>

        {/* Assigned Sites List */}
        <div style={{ padding: "20px", textAlign: "center" }}>
  <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>Assigned Sites</h2>

  {loading ? (
    <p>Loading sites...</p>
  ) : assignedSites.length > 0 ? (
    <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
  {assignedSites.map((site, index) => (
    <li 
      key={site._id || `site-${index}`} 
      style={{
        backgroundColor: "#E3F2FD",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
        display: "flex",
        flexDirection: "row", // Default: Side-by-side layout
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap", // ✅ Allows elements to wrap in smaller screens
        gap: "15px",
      }}
    >
      <div 
        style={{ 
          textAlign: "left", 
          flex: 1,
          minWidth: "250px", // ✅ Ensures content does not shrink too much
          wordBreak: "break-word" // ✅ Prevents text overflow issues
        }}
      >
        <strong>Client:</strong> {site.client_Id?.name || "N/A"} <br />
        <strong>Address:</strong> {site.site_address} <br />
        <strong>Total Cost:</strong> ₹{site.total_cost} <br />
        <strong>End Date:</strong> {new Date(site.end_date).toLocaleDateString()} <br />
        <strong>Project Manager:</strong> {site.project_manager?.name || "Not Assigned"} <br />
      </div>

      {/* Icons Section */}
      <div 
  style={{ 
    display: "flex", 
    gap: "35px", 
    fontSize: "50px", 
    flexWrap: "wrap", 
    justifyContent: "center",
    alignItems: "center"
  }}
>
  {/* View Client Button */}
  <button 
    onClick={() => fetchClientDetails(site.client_Id?._id)} 
    style={{ 
      color: "#007BFF", 
      border: "none", 
      background: "none", 
      fontSize: "40px", 
      cursor: "pointer",
      transition: "color 0.3s ease, transform 0.3s ease",
      marginRight:"30px"

    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#0056b3"; e.currentTarget.style.transform = "scale(1.2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "#007BFF"; e.currentTarget.style.transform = "scale(1)"; }}
  >
    <FaUserTie title="View Client" />
  </button>

  {/* View Employees Button */}
  <button 
    onClick={() => fetchEmployees(site._id)} 
    style={{ 
      color: "#007BFF", 
      border: "none", 
      background: "none", 
      fontSize: "40px", 
      cursor: "pointer",
      transition: "color 0.3s ease, transform 0.3s ease",
      marginRight:"30px"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#0056b3"; e.currentTarget.style.transform = "scale(1.2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "#007BFF"; e.currentTarget.style.transform = "scale(1)"; }}
  >
    <FaUsers title="View Employees" />
  </button>

  {/* View Reports Link
  <Link 
    to={`/manager/reports/${site._id}`} 
    title="View Reports" 
    style={{ 
      color: "#DC3545", 
      fontSize: "40px",
      transition: "color 0.3s ease, transform 0.3s ease"
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#a71d2a"; e.currentTarget.style.transform = "scale(1.2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "#DC3545"; e.currentTarget.style.transform = "scale(1)"; }}
  >
    <FaClipboardList />
  </Link> */}
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
    employees.map((empCategory, categoryIndex) => (
      <div key={empCategory._id || `category-${categoryIndex}`}>
        <h6>{empCategory.category}</h6>
        <ul>
          {empCategory.employees.length > 0 ? (
            empCategory.employees.map((emp, empIndex) => (
              <li key={emp._id ? emp._id : `emp-${categoryIndex}-${empIndex}`}>
                {emp.name}
              </li>
            ))
          ) : (
            <p key={`no-emp-${categoryIndex}`}>No employees in this category.</p>
          )}
        </ul>
      </div>
    ))
  ) : (
    <p key="no-employees">No employees assigned.</p>
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

export default SupervisorAssignedSites;
