import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tooltip, IconButton
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import {
    FaCheck, FaTimes, FaEye, FaTrash, FaBuilding, FaUserMinus, FaInfoCircle
} from "react-icons/fa";

const ViewManager = () => {
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openSitesDialog, setOpenSitesDialog] = useState(false);
    const [openManagerDetails, setOpenManagerDetails] = useState(false);
    const [assignedSites, setAssignedSites] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openImageDialog, setOpenImageDialog] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:5004/api/managerregister/Getmanager");
            setManagers(response.data?.data || response.data || []);
        } catch (error) {
            setError("Failed to fetch managers. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5004/api/managerregister/updateStatus/${id}`, { status: newStatus });
            fetchManagers();
        } catch (error) {
            console.error("Error updating manager status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this manager?")) {
            try {
                await axios.delete(`http://localhost:5004/api/managerregister/Deletemanager/${id}`);
                setManagers(managers.filter(manager => manager._id !== id));
            } catch (error) {
                console.error("Error deleting manager:", error);
            }
        }
    };

    const handleViewSites = async (manager) => {
        try {
            const response = await axios.get(`http://localhost:5004/api/siteregister/getManagerSites/${manager._id}`);
            setAssignedSites(Array.isArray(response.data) ? response.data : []);
            setSelectedManager(manager);
            setOpenSitesDialog(true);
        } catch (error) {
            console.error("Error fetching assigned sites:", error);
            setAssignedSites([]);
            setOpenSitesDialog(true);
        }
    };

    const handleRemoveManager = async (siteId) => {
        if (window.confirm("Are you sure you want to remove this manager from the site?")) {
            try {
                const response = await axios.put(`http://localhost:5004/api/siteregister/removeManager/${siteId}`);
                if (response.status === 200) {
                    setAssignedSites(prevSites => prevSites.filter(site => site._id !== siteId));
                    alert("Manager removed successfully.");
                } else {
                    alert("Failed to remove manager. Please try again.");
                }
            } catch (error) {
                console.error("Error removing manager:", error);
                alert("Error removing manager. Please try again.");
            }
        }
    };

    const handleViewManagerDetails = (manager) => {
        setSelectedManager(manager);
        setOpenManagerDetails(true);
    };

    const handleImagePreview = (url) => {
        setSelectedImage(url);
        setOpenImageDialog(true);
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: "bold", fontSize: "28px", marginBottom: "30px" }}>Project Manager Management</h2>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <div style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>{error}</div>
            ) : managers.length === 0 ? (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>No managers available</div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>#</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Profile</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">Address</TableCell>
                                <TableCell align="center">ID Proof</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {managers.map((manager, index) => (
                                <TableRow key={manager._id}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">{manager.name}</TableCell>
                                    <TableCell align="center">
                                        {manager.image ? (
                                            <IconButton onClick={() => handleImagePreview(manager.image)} color="primary">
                                                <VisibilityIcon />
                                            </IconButton>
                                        ) : (
                                            <span>No Image</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">{manager.email}</TableCell>
                                    <TableCell align="center">{manager.phone}</TableCell>
                                    <TableCell align="center">{manager.address}</TableCell>
                                    <TableCell align="center">
                                        {manager.idProof ? (
                                            <IconButton onClick={() => handleImagePreview(manager.idProof)} color="secondary">
                                                <VisibilityIcon />
                                            </IconButton>
                                        ) : (
                                            <span>No ID Proof</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" style={{ fontWeight: "bold", color: manager.status === "Approved" ? "green" : "red" }}>
                                        {manager.status || "Pending"}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Approve">
                                            <IconButton color="success" onClick={() => handleStatusUpdate(manager._id, "Approved")}>
                                                <FaCheck />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton color="error" onClick={() => handleStatusUpdate(manager._id, "Rejected")}>
                                                <FaTimes />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Assigned Sites">
                                            <IconButton color="primary" onClick={() => handleViewSites(manager)}>
                                                <FaBuilding />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Details">
                                            <IconButton color="info" onClick={() => handleViewManagerDetails(manager)}>
                                                <FaInfoCircle />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="warning" onClick={() => handleDelete(manager._id)}>
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

            {/* Manager Details Dialog */}
            <Dialog open={openManagerDetails} onClose={() => setOpenManagerDetails(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Manager Details</DialogTitle>
                <DialogContent>
                    {selectedManager && (
                        <div style={{ padding: "10px" }}>
                            <p><strong>Name:</strong> {selectedManager.name}</p>
                            <p><strong>Email:</strong> {selectedManager.email}</p>
                            <p><strong>Phone:</strong> {selectedManager.phone}</p>
                            <p><strong>Address:</strong> {selectedManager.address}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenManagerDetails(false)} variant="contained" color="primary">Close</Button>
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
                                            <TableCell align="center">₹{site.total_cost || "N/A"}</TableCell>
                                            <TableCell align="center">{new Date(site.end_date).toLocaleDateString() || "N/A"}</TableCell>
                                            <TableCell align="center">{site.client_Id?.name || "Unknown"}</TableCell>
                                            <TableCell align="center">{site.client_Id?.email || "Unknown"}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Remove Manager">
                                                    <IconButton color="error" onClick={() => handleRemoveManager(site._id)}>
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
                            No sites assigned to this manager.
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSitesDialog(false)} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Image Preview Dialog */}
            <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="md">
                <DialogContent>
                    {selectedImage && <img src={selectedImage} alt="Preview" style={{ width: "100%", height: "auto" }} />}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenImageDialog(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewManager;
