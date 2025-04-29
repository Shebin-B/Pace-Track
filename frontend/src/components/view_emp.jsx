import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Tooltip, IconButton, TextField
} from "@mui/material";
import { FaTrash, FaEdit, FaEye, FaCalendarCheck,FaClipboardCheck, FaFileAlt } from "react-icons/fa"; // Importing distinct icons
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openSiteDialog, setOpenSiteDialog] = useState(false);
    const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
    const [assignedSites, setAssignedSites] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
const [selectedSite, setSelectedSite] = useState("");
const [availableSites, setAvailableSites] = useState([]);
const [selectedImage, setSelectedImage] = useState(null);
const [open, setOpen] = useState(false);
const navigate = useNavigate();


    const [editedEmployee, setEditedEmployee] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        work_category: "",
        salary: ""
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:5004/api/empregister/Getemployee");
            setEmployees(response.data || []);
        } catch (error) {
            console.error("Error fetching employees:", error);
            setError("Failed to fetch employees. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await axios.delete(`http://localhost:5004/api/empregister/Deleteemployee/${id}`);
                setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee._id !== id));
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        }
    };

    const handleEdit = (employee) => {
        setEditedEmployee({ ...employee });  // Populate dialog with existing data
        setOpenEditDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:5004/api/empregister/Updateemployee/${editedEmployee._id}`, editedEmployee);
            
            if (response.data.success) {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) =>
                        emp._id === editedEmployee._id ? editedEmployee : emp
                    )
                );
                setOpenEditDialog(false);
            } else {
                console.error("Update failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating employee:", error);
        }
    };
    
   
    

    // Fetch attendance records
    const handleViewAttendance = async (employee) => {
        setSelectedEmployee(employee);
        try {
            const response = await axios.get(`http://localhost:5004/api/attendance/getRecords/${employee._id}`);
            setAttendanceRecords(response.data.records || []);
            setOpenAttendanceDialog(true);
        } catch (error) {
            console.error("Error fetching attendance records:", error);
            setAttendanceRecords([]);
        }
    };

    const handleAssignSite = async (employee) => {
        setSelectedEmployee(employee);
        setOpenAssignDialog(true);
    
        try {
            const response = await axios.get("http://localhost:5004/api/siteregister/getsite");
    
            console.log("API Response:", response.data); // Debugging line
    
            if (Array.isArray(response.data.sites)) {
                setAvailableSites(response.data.sites);
            } else {
                console.error("Expected an array but got:", response.data);
                setAvailableSites([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error("Error fetching available sites:", error);
            setAvailableSites([]); // Prevents map crash
        }
    };
    const handleOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        setSelectedImage("");
    };

    

    const handleConfirmAssign = async () => {
        if (!selectedEmployee || !selectedSite) {
            alert("Please select a site and an employee!");
            return;
        }
    
        const requestData = {
            siteId: selectedSite,
            category: selectedEmployee.work_category, // Extract category from employee
            employeeIds: [selectedEmployee._id], // Send as an array
        };
    
        console.log("Sending Data:", requestData);
    
        try {
            const response = await axios.post(
                "http://localhost:5004/api/siteregister/assign-employee",
                requestData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
    
            if (response.data.success) {
                alert("Employee assigned successfully!");
                setOpenAssignDialog(false);
            } else {
                alert("Failed to assign employee.");
            }
        } catch (error) {
            console.error("Error assigning site:", error.response?.data || error);
        }
    };

    const handleViewSite = async (employee) => {
        if (!employee || !employee._id) {
            console.error("❌ Invalid Employee Object:", employee);
            alert("Invalid Employee ID");
            return;
        }
    
        console.log("🛠️ Sending request for Employee ID:", employee._id); // Debugging
    
        try {
            const response = await axios.get(`http://localhost:5004/api/siteregister/assigned-sites/${employee._id}`);
            console.log("✅ Assigned Sites Response:", response.data);
            
            setAssignedSites(response.data.sites || []);
            setOpenSiteDialog(true);
        } catch (error) {
            console.error("🔥 Error fetching assigned sites:", error.response?.data || error.message);
            
            if (error.response?.status === 404) {
                alert("No assigned sites found for this employee.");
            } else {
                alert("Failed to fetch assigned sites. Please try again.");
            }
            
            setAssignedSites([]);
        }
    };
    
    const handleViewReport = (employee) => {
        navigate(`/report/${employee._id}`); // Ensure employee has an _id field
    };
    
    const handleRemoveEmployee = async (siteId, employeeId) => {
        if (!employeeId) {
            console.error("❌ Error: Missing Employee ID");
            alert("Employee ID is missing. Cannot proceed.");
            return;
        }
    
        console.log("📌 Removing Employee from Site...");
        console.log("🆔 Site ID:", siteId);
        console.log("🆔 Employee ID:", employeeId);
    
        try {
            const response = await fetch("http://localhost:5004/api/siteregister/remove-employee", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siteId: siteId,
                    employeeId: employeeId,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log("✅ Employee removed successfully:", data);
            alert("Employee removed successfully.");
        } catch (error) {
            console.error("❌ Error removing employee:", error);
            alert("Failed to remove employee.");
        }
    };
    
    return (
        <div style={{ padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h2 style={{ textAlign: "center", color: "#333", fontWeight: "bold", fontSize: "28px", marginBottom: "30px" }}>Employee Management</h2>

            {loading ? (
                <CircularProgress size={60} />
            ) : error ? (
                <div style={{ color: "red", fontWeight: "bold", fontSize: "18px" }}>{error}</div>
            ) : employees.length === 0 ? (
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "gray" }}>No employees available</div>
            ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, width: "90%" }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: "#e0e0e0" }}>
                                <TableCell align="center">#</TableCell>
                                <TableCell align="center">Profile</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Email</TableCell>
                                <TableCell align="center">Phone</TableCell>
                                <TableCell align="center">ID proof</TableCell>
                                <TableCell align="center">Work Category</TableCell>
                                <TableCell align="center">Salary</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employees.map((employee, index) => (
                                <TableRow key={employee._id}>
                                    <TableCell align="center">{index + 1}</TableCell>
                                    <TableCell align="center">
                        {employee.image ? (
                            <IconButton onClick={() => handleOpen(employee.image)} color="secondary">
                                <VisibilityIcon />
                            </IconButton>
                        ) : (
                            <span>No ID Proof</span>
                        )}
                    </TableCell>
                                    <TableCell align="center">{employee.name}</TableCell>
                                    <TableCell align="center">{employee.email}</TableCell>
                                    <TableCell align="center">{employee.phone}</TableCell>
                                    <TableCell align="center">
                    {employee.idProof ? (
                      <IconButton onClick={() => handleOpen(employee.idProof)} color="secondary">
                        <VisibilityIcon />
                      </IconButton>
                    ) : (
                      <span>No ID Proof</span>
                    )}
                  </TableCell>
                                    <TableCell align="center">{employee.work_category}</TableCell>
                                    <TableCell align="center">{employee.salary}</TableCell>
                                    <TableCell align="center">
    <Tooltip title="Edit">
        <IconButton color="primary" sx={{ mx: 0.5 }} onClick={() => handleEdit(employee)}>
            <FaEdit />
        </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
        <IconButton color="warning" sx={{ mx: 0.5 }} onClick={() => handleDelete(employee._id)}>
            <FaTrash />
        </IconButton>
    </Tooltip>
    <Tooltip title="Assign Site">
        <IconButton color="secondary" sx={{ mx: 0.5 }} onClick={() => handleAssignSite(employee)}>
            <FaClipboardCheck />
        </IconButton>
    </Tooltip>
    <Tooltip title="View Assigned Site">
        <IconButton color="info" sx={{ mx: 0.5 }} onClick={() => handleViewSite(employee)}>
            <FaEye />
        </IconButton>
    </Tooltip>
    <Tooltip title="View Attendance">
        <IconButton color="success" sx={{ mx: 0.5 }} onClick={() => handleViewAttendance(employee)}>
            <FaCalendarCheck />
        </IconButton>
    </Tooltip>
    <Tooltip title="View Report">
    <IconButton color="primary" sx={{ mx: 0.5 }} onClick={() => handleViewReport(employee)}>
        <FaFileAlt />
    </IconButton>
</Tooltip>
</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* View Assigned Sites Dialog */}
            <Dialog open={openSiteDialog} onClose={() => setOpenSiteDialog(false)} maxWidth="sm" fullWidth>
    <DialogTitle>Assigned Sites for {selectedEmployee?.name}</DialogTitle>
    <DialogContent>
    {assignedSites.length > 0 ? (
        assignedSites.map(site => (
            <div key={site._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p>{site.site_address}</p>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => {
                        console.log("🔍 Full site object:", site); // Debugging output
                    
                        // Extracting first employee's ID from the first assigned category
                        const employeeId = site.assignedEmployees?.[0]?.employees?.[0]?._id;
                    
                        if (!employeeId) {
                            console.error("❌ Employee ID is missing for site:", site);
                            alert("Error: Employee ID is missing.");
                            return;
                        }
                    
                        console.log("📌 Removing Employee from Site...");
                        console.log("🆔 Site ID:", site._id);
                        console.log("🆔 Employee ID:", employeeId); // Should only print the ObjectId
                    
                        handleRemoveEmployee(site._id, employeeId);
                    }}
                    
                >
                    Remove
                </Button>
            </div>
        ))
    ) : (
        <p>No assigned sites found.</p>
    )}
</DialogContent>


    <DialogActions>
        <Button onClick={() => setOpenSiteDialog(false)}>Close</Button>
    </DialogActions>
</Dialog>


            {/* View Attendance Dialog */}
            <Dialog open={openAttendanceDialog} onClose={() => setOpenAttendanceDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Attendance Records for {selectedEmployee?.name}</DialogTitle>
                <DialogContent>
                    {attendanceRecords.length > 0 ? attendanceRecords.map(record => (
                        <p key={record._id}>{record.date}: {record.status}</p>
                    )) : <p>No attendance records found.</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAttendanceDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Name" value={editedEmployee.name} onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })} margin="dense" />
                    <TextField fullWidth label="Email" value={editedEmployee.email} onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })} margin="dense" />
                    <TextField fullWidth label="Phone" value={editedEmployee.phone} onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })} margin="dense" />
                    <TextField fullWidth label="Address" value={editedEmployee.address} onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })} margin="dense" />
                    <TextField fullWidth label="Work Category" value={editedEmployee.work_category} onChange={(e) => setEditedEmployee({ ...editedEmployee, work_category: e.target.value })} margin="dense" />
                    <TextField fullWidth label="Salary" value={editedEmployee.salary} onChange={(e) => setEditedEmployee({ ...editedEmployee, salary: e.target.value })} margin="dense" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
    <DialogTitle>Assign Site to {selectedEmployee?.name}</DialogTitle>
    <DialogContent>
        <FormControl fullWidth>
            <InputLabel>Select Site</InputLabel>
            <Select value={selectedSite} onChange={(e) => setSelectedSite(e.target.value)}>
    {availableSites.length > 0 ? (
        availableSites.map((site) => (
            <MenuItem key={site._id} value={site._id}>
                {site.site_address || "Unnamed Site"}
            </MenuItem>
        ))
    ) : (
        <MenuItem disabled>No sites available</MenuItem>
    )}
</Select>
        </FormControl>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
        <Button onClick={handleConfirmAssign} variant="contained">Assign</Button>
    </DialogActions>
</Dialog>

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

export default ViewEmployee;
