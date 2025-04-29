import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, 
    CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, 
    FormControl, InputLabel, Box 
} from "@mui/material";
import { List, ListItem, ListItemText } from "@mui/material";


import { FaEye, FaTrash, FaPlus, FaUsers, FaUserTie, FaUserShield } from "react-icons/fa";

const Viewsite = () => {
    const [sites, setSites] = useState([]);
    const navigate = useNavigate();
    const [projectManagers, setProjectManagers] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    



    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSite, setSelectedSite] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [assignDialog, setAssignDialog] = useState(false);
    const [assignManagerDialog, setAssignManagerDialog] = useState(false);
    const [assignSupervisorDialog, setAssignSupervisorDialog] = useState(false);
    const [selectedManager, setSelectedManager] = useState("");
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [employeesDialog, setEmployeesDialog] = useState(false);
    const [employees, setEmployees] = useState([]);
    

    useEffect(() => {
        fetchSites();
        fetchProjectManagers();
        fetchProjectsupervisor();
    }, []);

    const fetchSites = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/siteregister/getsite");
            console.log("Sites API Response:", response.data.sites);
            setSites(Array.isArray(response.data.sites) ? response.data.sites : []);
        } catch (error) {
            console.error("Error fetching sites:", error);
            setError("Failed to fetch sites. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectManagers = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/siteregister/getmanager");
            console.log("Project Managers API Response:", response.data);
    
            if (response.data && Array.isArray(response.data)) {
                setProjectManagers(response.data);
            } else {
                console.error("Unexpected API response format:", response.data);
                setProjectManagers([]); // Ensure the dropdown does not break
            }
        } catch (error) {
            console.error("Error fetching project managers:", error);
            setProjectManagers([]); // Handle errors by resetting the list
        }
    };
    
    const fetchProjectsupervisor = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/siteregister/getsupervisor");
            console.log("Supervisor API Response:", response.data);
    
            if (response.data && Array.isArray(response.data)) {
                setSupervisors(response.data);
            } else {
                console.error("Unexpected API response format:", response.data);
                setSupervisors([]); // Ensure the dropdown does not break
            }
        } catch (error) {
            console.error("Error fetching project supervisors:", error);
            setSupervisors([]); // Handle errors by resetting the list
        }
    };
    
    

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this site?")) {
            try {
                await axios.delete(`http://localhost:5004/api/siteregister/deletesite/${id}`);
                setSites(prevSites => prevSites.filter(site => site._id !== id));
            } catch (error) {
                console.error("Error deleting site:", error);
            }
        }
    };

    const handleAssignManager = async () => {
        if (!selectedManager || !selectedSite) {
            alert("Please select a project manager and site.");
            return;
        }
    
        try {
            const response = await axios.put(
                "http://localhost:5004/api/siteregister/assign-manager",
                {
                    siteId: selectedSite._id,
                    projectManagerId: selectedManager,
                }
            );
    
            if (response.data.success) {
                
                fetchSites(); // ✅ Refresh data
                setAssignDialog(false); // ✅ Close dialog
            } else {
                alert(response.data.msg);
            }
        } catch (error) {
            console.error("Error assigning project manager:", error);
            alert("Failed to assign project manager.");
        }
    };
    


    const handleAssignSupervisor = async () => {
        if (!selectedSupervisor || !selectedSite) {
            alert("Please select a supervisor and site.");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:5004/api/siteregister/assign-supervisor",
                {
                    siteId: selectedSite._id,
                    supervisorId: selectedSupervisor,
                }
            );
    
            if (response.data.success) {
                alert("Supervisor assigned successfully!");
                fetchSites(); // ✅ Refresh the table
                setAssignSupervisorDialog(false);
            } else {
                alert(response.data.msg);
            }
        } catch (error) {
            console.error("Error assigning supervisor:", error);
            alert("Failed to assign supervisor.");
        }
    };
    
    
    
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
    
    
    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: "bold", fontSize: "28px", marginBottom: "30px" }}>Site Management</h2>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center">Customer</TableCell>
                                <TableCell align="center">Total Cost</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">End Date</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Project Manager</TableCell>
                                <TableCell align="center">Site Supervisor</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sites.map((site) => (
                                <TableRow key={site._id}>
                                    <TableCell align="center">{site.client_Id?.name || "Unknown"}</TableCell>
                                    <TableCell align="center">{site.total_cost}</TableCell>
                                    <TableCell align="center">{site.site_address}</TableCell>
                                    <TableCell align="center">{site.end_date}</TableCell>
                                    <TableCell align="center">{site.status}</TableCell>
                                    <TableCell align="center">
    {site.project_manager && site.project_manager.name ? site.project_manager.name : "Not Assigned"}
</TableCell>
<TableCell align="center">
    {site.supervisor ? site.supervisor.name : "Not Assigned"}
</TableCell>









<TableCell align="center">
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <Tooltip title="View Details">
            <IconButton color="info" onClick={() => { setSelectedSite(site); setOpenDialog(true); }}>
                <FaEye />
            </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(site._id)}>
                <FaTrash />
            </IconButton>
        </Tooltip>
        <Tooltip title="Add Logs">
            <IconButton color="primary">
                <FaPlus />
            </IconButton>
        </Tooltip>
       <Tooltip title="View Employees">
    <IconButton color="success" onClick={() => fetchEmployees(site._id)}>
        <FaUsers />
    </IconButton>
</Tooltip>
<Tooltip title="Assign Project Manager">
    <IconButton color="warning" onClick={() => { setSelectedSite(site); setAssignManagerDialog(true); }}>
        <FaUserTie />
    </IconButton>
</Tooltip>

<Tooltip title="Assign Supervisor">
    <IconButton color="warning" onClick={() => { setSelectedSite(site); setAssignSupervisorDialog(true); }}>
        <FaUserShield />
    </IconButton>
</Tooltip>
    </Box>
</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Assign Project Manager Dialog */}
<Dialog open={assignManagerDialog} onClose={() => setAssignManagerDialog(false)} maxWidth="sm" fullWidth>
    <DialogTitle>Assign Project Manager</DialogTitle>
    <DialogContent>
        <FormControl fullWidth>
            <InputLabel>Select Project Manager</InputLabel>
            <Select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
                {projectManagers.length > 0 ? (
                    projectManagers.map((manager) => (
                        <MenuItem key={manager._id} value={manager._id}>
                            {manager.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No Approved Managers</MenuItem>
                )}
            </Select>
        </FormControl>
    </DialogContent>
    <DialogActions>
    <Button 
    onClick={async () => {
        await handleAssignManager(); // ✅ Wait for API call to complete
        alert("Project Manager assigned successfully!"); // ✅ Show alert
        setAssignManagerDialog(false); // ✅ Close dialog AFTER alert dismissal
    }} 
    variant="contained" 
    color="success"
>
    Assign
</Button>


        <Button onClick={() => setAssignManagerDialog(false)} variant="contained" color="secondary">Cancel</Button>
    </DialogActions>
</Dialog>

{/* Assign Supervisor Dialog */}
<Dialog open={assignSupervisorDialog} onClose={() => setAssignSupervisorDialog(false)} maxWidth="sm" fullWidth>
    <DialogTitle>Assign Supervisor</DialogTitle>
    <DialogContent>
        <FormControl fullWidth>
            <InputLabel>Select Supervisor</InputLabel>
            <Select value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)}>
                {supervisors.length > 0 ? (
                    supervisors.map((supervisor) => (
                        <MenuItem key={supervisor._id} value={supervisor._id}>
                            {supervisor.name}
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No Approved Supervisors</MenuItem>
                )}
            </Select>
        </FormControl>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleAssignSupervisor} variant="contained" color="success">Assign</Button>
        <Button onClick={() => setAssignSupervisorDialog(false)} variant="contained" color="secondary">Cancel</Button>
    </DialogActions>
</Dialog>


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


<button 
    onClick={() => navigate(-1)} 
    style={{
        backgroundColor: "#1976d2",  // Primary blue
        color: "white",
        border: "none",
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "15px",
        marginTop: "20px",
        transition: "background-color 0.3s, transform 0.2s"
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = "#1565c0"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#1976d2"}
    onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
    onMouseUp={(e) => e.target.style.transform = "scale(1)"}
>
    ⬅ Go Back
</button>

        </div>
    );
};

export default Viewsite;
