import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tooltip, IconButton
} from "@mui/material";
import { FaCheck, FaTimes, FaEye, FaTrash, FaBuilding, FaUserMinus, FaInfoCircle } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ViewSupervisor = () => {
    const [supervisors, setSupervisors] = useState([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSitesDialog, setOpenSitesDialog] = useState(false);
    const [openSupervisorDetails, setOpenSupervisorDetails] = useState(false);
    const [assignedSites, setAssignedSites] = useState([]);

    // New state for image dialog
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchSupervisors();
    }, []);

    const fetchSupervisors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5004/api/supervisorregister/Getsupervisor");
            setSupervisors(response.data?.data || response.data || []);
        } catch (error) {
            setError("Failed to fetch supervisors. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5004/api/supervisorregister/updatesupervisorStatus/${id}`, { status: newStatus });
            fetchSupervisors();
        } catch (error) {
            console.error("Error updating supervisor status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supervisor?")) {
            try {
                await axios.delete(`http://localhost:5004/api/supervisorregister/Deletesupervisor/${id}`);
                setSupervisors(supervisors.filter(supervisor => supervisor._id !== id));
            } catch (error) {
                console.error("Error deleting supervisor:", error);
            }
        }
    };

    const handleViewSites = async (supervisor) => {
        try {
            const response = await axios.get(`http://localhost:5004/api/supervisorregister/getSupervisorSites/${supervisor._id}`);
            if (Array.isArray(response.data)) {
                setAssignedSites(response.data);
            } else {
                setAssignedSites([]);
            }
            setSelectedSupervisor(supervisor);
            setOpenSitesDialog(true);
        } catch (error) {
            console.error("Error fetching assigned sites:", error);
            setAssignedSites([]);
            setOpenSitesDialog(true);
        }
    };

    const handleRemoveSupervisor = async (siteId) => {
        if (window.confirm("Are you sure you want to remove this supervisor from the site?")) {
            try {
                const response = await axios.put(`http://localhost:5004/api/supervisorregister//removeSupervisor/${siteId}`);
                if (response.status === 200) {
                    setAssignedSites(prevSites => prevSites.filter(site => site._id !== siteId));
                    alert("Supervisor removed successfully.");
                } else {
                    alert("Failed to remove supervisor. Please try again.");
                }
            } catch (error) {
                console.error("Error removing supervisor:", error);
                alert("Error removing supervisor. Please check your connection and try again.");
            }
        }
    };

    const handleViewSupervisorDetails = (supervisor) => {
        setSelectedSupervisor(supervisor);
        setOpenSupervisorDetails(true);
    };

    const handleOpenImageDialog = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImageDialogOpen(true);
    };

    const handleCloseImageDialog = () => {
        setSelectedImage(null);
        setImageDialogOpen(false);
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: "bold", fontSize: "28px", marginBottom: "30px" }}>
                Project Supervisor Management
            </h2>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <div style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>{error}</div>
            ) : supervisors.length === 0 ? (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>No supervisors available</div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>#</TableCell>
                                <TableCell align="center">Profile</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">ID Proof</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {supervisors.map((supervisor, index) => (
                                <TableRow key={supervisor._id}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">
                                        {supervisor.image ? (
                                            <IconButton onClick={() => handleOpenImageDialog(supervisor.image)} color="primary">
                                                <VisibilityIcon />
                                            </IconButton>
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{supervisor.name}</TableCell>
                                    <TableCell align="center">{supervisor.email}</TableCell>
                                    <TableCell align="center">{supervisor.phone}</TableCell>
                                    <TableCell align="center">{supervisor.address}</TableCell>
                                    <TableCell align="center">
                                        {supervisor.idProof ? (
                                            <IconButton onClick={() => handleOpenImageDialog(supervisor.idProof)} color="secondary">
                                                <VisibilityIcon />
                                            </IconButton>
                                        ) : (
                                            <span>No ID Proof</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" style={{ fontWeight: "bold", color: supervisor.status === "Approved" ? "green" : "red" }}>
                                        {supervisor.status || "Pending"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Approve">
                                            <IconButton color="success" onClick={() => handleStatusUpdate(supervisor._id, "Approved")} sx={{ mx: 0.5 }}>
                                                <FaCheck />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton color="error" onClick={() => handleStatusUpdate(supervisor._id, "Rejected")} sx={{ mx: 0.5 }}>
                                                <FaTimes />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Assigned Sites">
                                            <IconButton color="primary" onClick={() => handleViewSites(supervisor)} sx={{ mx: 0.5 }}>
                                                <FaBuilding />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="warning" onClick={() => handleDelete(supervisor._id)} sx={{ mx: 0.5 }}>
                                                <FaTrash />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Supervisor Details Dialog */}
            <Dialog open={openSupervisorDetails} onClose={() => setOpenSupervisorDetails(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Supervisor Details</DialogTitle>
                <DialogContent>
                    {selectedSupervisor && (
                        <div style={{ padding: "10px" }}>
                            <p><strong>Name:</strong> {selectedSupervisor.name}</p>
                            <p><strong>Email:</strong> {selectedSupervisor.email}</p>
                            <p><strong>Phone:</strong> {selectedSupervisor.phone}</p>
                            <p><strong>Address:</strong> {selectedSupervisor.address}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSupervisorDetails(false)} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Assigned Sites Dialog */}
            <Dialog open={openSitesDialog} onClose={() => setOpenSitesDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Assigned Sites</DialogTitle>
                <DialogContent dividers>
                    {assignedSites.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                        <TableCell align="center">Site Address</TableCell>
                                        <TableCell align="center">Total Cost</TableCell>
                                        <TableCell align="center">End Date</TableCell>
                                        <TableCell align="center">Client Name</TableCell>
                                        <TableCell align="center">Client Email</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {assignedSites.map((site) => (
                                        <TableRow key={site._id}>
                                            <TableCell align="center">{site.site_address || "N/A"}</TableCell>
                                            <TableCell align="center">${site.total_cost || "N/A"}</TableCell>
                                            <TableCell align="center">{new Date(site.end_date).toLocaleDateString() || "N/A"}</TableCell>
                                            <TableCell align="center">{site.client_Id?.name || "Unknown"}</TableCell>
                                            <TableCell align="center">{site.client_Id?.email || "Unknown"}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Remove Supervisor">
                                                    <IconButton color="error" onClick={() => handleRemoveSupervisor(site._id)}>
                                                        <FaUserMinus />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <div style={{ textAlign: "center", fontSize: "18px", color: "gray" }}>
                            No sites assigned to this supervisor.
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSitesDialog(false)} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="md">
                <DialogContent>
                    {selectedImage && (
                        <img src={selectedImage} alt="Preview" style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImageDialog} variant="contained">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewSupervisor;
