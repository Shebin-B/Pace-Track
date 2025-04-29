import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tooltip, IconButton
} from "@mui/material";
import { FaCheck, FaTimes, FaEye, FaTrash, FaPlus, FaMapMarkerAlt } from "react-icons/fa"; // Import new icon
import VisibilityIcon from "@mui/icons-material/Visibility";


const ViewClient = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const navigate = useNavigate(); // For navigation
    const handleOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setSelectedImage("");
    };
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/clientregister/Getclient");
            console.log("Fetched Clients:", response.data); // Debugging
            setClients(response.data || []); // Ensure data is not null
        } catch (error) {
            console.error("Error fetching clients:", error);
            setError("Failed to fetch clients. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5004/api/clientregister/updateStatus/${id}`,
                { status: newStatus }
            );
    
            if (response.status === 200) {
                console.log("Status updated successfully");
                fetchClients(); // ✅ Re-fetch client list after update
            }
        } catch (error) {
            console.error("Error updating client status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await axios.delete(`http://localhost:5004/api/clientregister/Deleteclient/${id}`);
                setClients(prevClients => prevClients.filter(client => client._id !== id));
            } catch (error) {
                console.error("Error deleting client:", error);
            }
        }
    };

    // Corrected handleRegisterSite function
    const handleRegisterSite = (clientId) => {
        navigate(`/site_reg/${clientId}`);
    };

    // Function to navigate to client's sites
    const handleViewSites = (clientId) => {
        navigate(`/viewclientsite/${clientId}`);
    };

    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: "bold", fontSize: "28px", marginBottom: "30px" }}>Client Management</h2>

            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                    <CircularProgress size={60} />
                </div>
            ) : error ? (
                <div style={{ textAlign: "center", color: "red", fontWeight: "bold", fontSize: "18px" }}>{error}</div>
            ) : clients.length === 0 ? (
                <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "gray" }}>No clients available</div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                        <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>#</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Profile</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Email</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Phone</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Address</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>ID Proof</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "20px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client, index) => (
                                <TableRow key={client._id} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                                    <TableCell align="center" sx={{ fontSize: "18px" }}>{index + 1}</TableCell>
                                    
                                   

                                    <TableCell align="center">
    {client.image ? (
        <IconButton onClick={() => handleOpen(client.image)} color="primary">
            <VisibilityIcon />
        </IconButton>
    ) : (
        <span>No Image</span>
    )}
</TableCell>


<TableCell align="center">{client.name}</TableCell>
<TableCell align="center">{client.email}</TableCell>
<TableCell align="center">{client.phone}</TableCell>
<TableCell align="center">{client.address}</TableCell>

{/* ID Proof */}
<TableCell align="center">
                        {client.idProof ? (
                            <IconButton onClick={() => handleOpen(client.idProof)} color="secondary">
                                <VisibilityIcon />
                            </IconButton>
                        ) : (
                            <span>No ID Proof</span>
                        )}
                    </TableCell>
                                    <TableCell align="center" sx={{ fontSize: "18px", fontWeight: "bold", color: client.status === "Approved" ? "green" : client.status === "Rejected" ? "red" : "gray" }}>
                                        {client.status || "Pending"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ display: "flex", justifyContent: "center", gap: "14px" }}>
                                        <Tooltip title="Approve">
                                            <IconButton color="success" onClick={() => handleStatusUpdate(client._id, "Approved")}>
                                                <FaCheck />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton color="error" onClick={() => handleStatusUpdate(client._id, "Rejected")}>
                                                <FaTimes />
                                            </IconButton>
                                        </Tooltip>
                                     
                                        <Tooltip title="Delete">
                                            <IconButton color="warning" onClick={() => handleDelete(client._id)}>
                                                <FaTrash />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Register Site">
                                            <IconButton color="primary" onClick={() => handleRegisterSite(client._id)}>
                                                <FaPlus />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Sites">
                                            <IconButton color="secondary" onClick={() => handleViewSites(client._id)}>
                                                <FaMapMarkerAlt />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
             <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent>
                    <img src={selectedImage} alt="Full View" style={{ width: "100%", height: "auto" }} />
                </DialogContent>
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

export default ViewClient;
