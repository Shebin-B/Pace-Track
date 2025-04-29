import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, 
    CircularProgress, Typography, Button, Dialog, DialogActions, DialogContent, List, DialogTitle, Box
} from "@mui/material";
import { FaEye, FaUsers, FaClipboardList, FaFileAlt, FaUserTie } from "react-icons/fa";

const ClientSites = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for dialogs
    const [managerDialogOpen, setManagerDialogOpen] = useState(false);
    const [supervisorDialogOpen, setSupervisorDialogOpen] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [employeesDialog, setEmployeesDialog] = useState(false);
    const [employees, setEmployees] = useState([]);

    

    useEffect(() => {
        if (clientId) {
            fetchSites(clientId);
        }
    }, [clientId]);

    const fetchSites = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:5004/api/siteregister/viewclientsite/${clientId}`);
            console.log("Sites API Response:", response.data);
            response.data.forEach((site, index) => {
                console.log(`Site ${index + 1} - Project Manager:`, site.project_manager);
            });
            setSites(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching sites:", error);
            setError(error.response?.data?.message || "Failed to fetch sites. Please try again.");
        } finally {
            setLoading(false);
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
    const handleOpenManagerDialog = (manager) => {
        setSelectedManager(manager);
        setManagerDialogOpen(true);
    };

    const handleOpenSupervisorDialog = (supervisor) => {
        setSelectedSupervisor(supervisor);
        setSupervisorDialogOpen(true);
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#eef2f3", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "#333" }}>
                {sites.length > 0 ? `Sites for Client ${sites[0].client_Id?.name || "Unknown"}` : "Site Management"}
            </Typography>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <Typography color="error" fontWeight="bold">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 5, borderRadius: 3, width: "90%", overflow: "hidden" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#1565C0", color: "white" }}>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Customer</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Total Cost</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Address</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>End Date</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Project Manager</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Site Supervisor</TableCell>
                                <TableCell align="center" sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sites.length > 0 ? (
                                sites.map((site) => (
                                    <TableRow key={site._id} hover>
                                        <TableCell align="center">{site.client_Id?.name || "Unknown"}</TableCell>
                                        <TableCell align="center">{site.total_cost || "N/A"}</TableCell>
                                        <TableCell align="center">{site.site_address || "N/A"}</TableCell>
                                        <TableCell align="center">{site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell align="center">{site.status || "N/A"}</TableCell>
                                        <TableCell align="center">
                                            {site.project_manager?.name || "Not Assigned"}
                                            {site.project_manager && (
                                                <Tooltip title="View Project Manager">
                                                    <IconButton sx={{ color: "#1976D2", ml: 1 }} onClick={() => handleOpenManagerDialog(site.project_manager)}>
                                                        <FaUserTie size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {site.site_supervisor?.name || "Not Assigned"}
                                            {site.site_supervisor && (
                                                <Tooltip title="View Site Supervisor">
                                                    <IconButton sx={{ color: "#D81B60", ml: 1 }} onClick={() => handleOpenSupervisorDialog(site.site_supervisor)}>
                                                        <FaUserTie size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                                
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                        <Tooltip title="View Employees">
                                          <IconButton color="success" onClick={() => fetchEmployees(site._id)}>
                                              <FaUsers />
                                          </IconButton>
                                      </Tooltip>
        
                                          
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        <Typography color="gray">No sites found for this client.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Project Manager Dialog */}
            <Dialog open={managerDialogOpen} onClose={() => setManagerDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#1976D2", color: "white" }}>
                    Project Manager Details
                </DialogTitle>
                <DialogContent sx={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
                    {selectedManager && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography><strong>Name:</strong> {selectedManager?.name || "N/A"}</Typography>
                            <Typography><strong>Email:</strong> {selectedManager?.email || "N/A"}</Typography>
                            <Typography><strong>Phone:</strong> {selectedManager?.phone || "N/A"}</Typography>
                            <Typography><strong>Address:</strong> {selectedManager?.address || "N/A"}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setManagerDialogOpen(false)} variant="contained" color="secondary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Site Supervisor Dialog */}
            <Dialog open={supervisorDialogOpen} onClose={() => setSupervisorDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#D81B60", color: "white" }}>
                    Site Supervisor Details
                </DialogTitle>
                <DialogContent sx={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
                    {selectedSupervisor && (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography><strong>Name:</strong> {selectedSupervisor?.name || "N/A"}</Typography>
                            <Typography><strong>Email:</strong> {selectedSupervisor?.email || "N/A"}</Typography>
                            <Typography><strong>Phone:</strong> {selectedSupervisor?.phone || "N/A"}</Typography>
                            <Typography><strong>Address:</strong> {selectedSupervisor?.address || "N/A"}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSupervisorDialogOpen(false)} variant="contained" color="secondary">Close</Button>
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

        </div>
    );
};

export default ClientSites;
