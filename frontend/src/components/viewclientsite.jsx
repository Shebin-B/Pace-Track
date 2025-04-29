import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip, IconButton, 
    CircularProgress, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, Box
} from "@mui/material";
import { FaEye, FaTrash, FaUserPlus } from "react-icons/fa";

const Viewclientsite = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectManagers, setProjectManagers] = useState([]);
    const [assignDialog, setAssignDialog] = useState(false);
    const [selectedManager, setSelectedManager] = useState("");
    const [selectedSite, setSelectedSite] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);

    useEffect(() => {
        if (clientId) {
            fetchSites(clientId);
            fetchProjectManagers();
        }
    }, [clientId]);

    const fetchSites = async (clientId) => {
        try {
            const response = await axios.get(`http://localhost:5004/api/siteregister/viewclientsite/${clientId}`);
            console.log("Sites API Response:", response.data);
            setSites(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching sites:", error);
            setError(error.response?.data?.message || "Failed to fetch sites. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProjectManagers = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/siteregister/getmanager");
            console.log("Project Managers API Response:", response.data);
            setProjectManagers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching project managers:", error);
            setProjectManagers([]);
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

    const handleViewDetails = (site) => {
        setSelectedSiteDetails(site);
        setDetailsDialogOpen(true);
    };

    const handleAssignManager = async () => {
        if (!selectedManager) {
            alert("Please select a project manager.");
            return;
        }
    
        try {
            await axios.put("http://localhost:5004/api/siteregister/assign-manager", {
                siteId: selectedSite._id,
                projectManagerId: selectedManager,
            });
    
            alert("Project Manager assigned successfully!");
            fetchSites(clientId);
            setAssignDialog(false);
        } catch (error) {
            console.error("Error assigning project manager:", error);
            alert("Failed to assign project manager.");
        }
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                {sites.length > 0 ? `Sites for Client ${sites[0].client_Id?.name || "Unknown"}` : "Site Management"}
            </Typography>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <Typography color="error" fontWeight="bold">{error}</Typography>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center">Customer</TableCell>
                                <TableCell align="center">Total Cost</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">End Date</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Project Manager</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sites.length > 0 ? (
                                sites.map((site) => (
                                    <TableRow key={site._id}>
                                        <TableCell align="center">{site.client_Id?.name || "Unknown"}</TableCell>
                                        <TableCell align="center">{site.total_cost || "N/A"}</TableCell>
                                        <TableCell align="center">{site.site_address || "N/A"}</TableCell>
                                        <TableCell align="center">{site.end_date ? new Date(site.end_date).toLocaleDateString() : "N/A"}</TableCell>
                                        <TableCell align="center">{site.status || "N/A"}</TableCell>
                                        <TableCell align="center">{site.project_manager?.name || "Not Assigned"}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="View Details">
                                                <IconButton color="info" onClick={() => handleViewDetails(site)} sx={{ mx: 1 }}>
                                                    <FaEye />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Site">
                                                <IconButton color="error" onClick={() => handleDelete(site._id)} sx={{ mx: 1 }}>
                                                    <FaTrash />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Assign Project Manager">
                                                <IconButton color="primary" onClick={() => { setSelectedSite(site); setAssignDialog(true); }} sx={{ mx: 1 }}>
                                                    <FaUserPlus />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography color="gray">No sites found for this client.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Site Details Dialog */}
            <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#1976d2", color: "white" }}>Site Details</DialogTitle>
                <DialogContent sx={{ padding: "20px", backgroundColor: "#f4f6f8" }}>
                    {selectedSiteDetails ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography><strong>Customer:</strong> {selectedSiteDetails.client_Id?.name || "Unknown"}</Typography>
                            <Typography><strong>Total Cost:</strong> {selectedSiteDetails.total_cost || "N/A"}</Typography>
                            <Typography><strong>Address:</strong> {selectedSiteDetails.site_address || "N/A"}</Typography>
                            <Typography><strong>End Date:</strong> {selectedSiteDetails.end_date ? new Date(selectedSiteDetails.end_date).toLocaleDateString() : "N/A"}</Typography>
                            <Typography><strong>Status:</strong> {selectedSiteDetails.status || "N/A"}</Typography>
                            <Typography><strong>Project Manager:</strong> {selectedSiteDetails.project_manager?.name || "Not Assigned"}</Typography>
                        </Box>
                    ) : (
                        <Typography>Loading site details...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)} variant="contained" color="primary">Close</Button>
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

export default Viewclientsite;
