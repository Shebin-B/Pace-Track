import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaUserClock, FaEye } from "react-icons/fa";

const AttendanceDashboard = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState({});
    const navigate = useNavigate();
    const [siteId, setSiteId] = useState(null);
    const { supervisorId } = useParams(); // Get supervisor ID from route params


    useEffect(() => {
        if (supervisorId) {
            console.log("Fetching assigned sites for Supervisor ID:", supervisorId);
            axios.get(`http://localhost:5004/api/attendence/sites/${supervisorId}`) // ✅ Ensure ID is passed in URL
                .then(res => {
                    console.log("Received Assigned Sites:", res.data);
                    setSites(res.data);
                })
                .catch(err => console.error("Error fetching assigned sites:", err));
        }
    }, [supervisorId]);
    

    // Handle site selection
    const handleSiteChange = (siteId) => {
        console.log("Site selected:", siteId);
        setSelectedSite(siteId);
        setSiteId(siteId);

        // Fetch employees based on selected site
        axios.get(`http://localhost:5004/api/attendence/employees/${siteId}`)
            .then(res => {
                setEmployees(res.data);
                setAttendance({});
            })
            .catch(err => console.error("Error fetching employees:", err));
    };

    // Handle attendance marking
    const handleAttendanceChange = (empId, status) => {
        setAttendance(prev => ({
            ...prev,
            [empId]: status
        }));
    };

    // Submit attendance records
    const handleSubmitAttendance = () => {
        // Check if attendance has any entries
        if (Object.keys(attendance).length === 0) {
            alert("⚠️ Please mark attendance before submitting.");
            return;
        }
    
        const attendanceRecords = Object.entries(attendance).map(([empId, status]) => ({
            employeeId: empId,
            status
        }));
    
        axios.post("http://localhost:5004/api/attendence/mark", { siteId: selectedSite, attendanceRecords })
            .then(res => {
                console.log("✅ Response from backend:", res.data);
                if (res.status === 201 || res.status === 200) {
                    if (res.data.alreadyMarked && res.data.alreadyMarked.length > 0) {
                        alert("⚠️ Attendance is already marked.");
                    } else {
                        alert("✅ Attendance saved successfully!");
                    }
                }
            })
            .catch(err => {
                console.log("❌ Error response:", err.response?.data);
                if (err.response && err.response.data) {
                    const message = err.response.data.message || "Unknown error occurred.";
                    const alreadyMarked = err.response.data.alreadyMarked || [];
                    if (alreadyMarked.length > 0) {
                        alert("⚠️ Attendance is already marked.");
                    } else {
                        alert(`⚠️ ${message}`);
                    }
                } else {
                    alert("⚠️ Server error. Please check your connection.");
                }
            });
    };
    
    // Navigate to attendance review page
    const handleReviewAttendance = (employeeId, siteId) => {
        console.log("Navigating with Employee ID:", employeeId, "and Site ID:", siteId);
        if (!employeeId || !siteId) {
            console.error("Error: Employee ID or Site ID is missing!");
            return;
        }
        navigate(`/attendancereview/${employeeId}/${siteId}`);
    };

    return (
        <div className="container-fluid p-0 h-100" style={{ background: "linear-gradient(to right, #1c1c1c, #2c3e50)", borderRadius: "0px", boxShadow: "none" }}>
            <div className="row h-100">
                <div className="col-12 d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
                    
                    {/* Header */}
                    <div className="py-4 text-center text-white mb-4" style={{ fontSize: "30px", fontWeight: "bold", textTransform: "uppercase" }}>
                        Admin Attendance Dashboard
                    </div>

                    <div className="container px-4 py-2 flex-grow-1">
                        
                        {/* Site Selection Dropdown */}
                        <div className="mb-4">
                            <label className="text-white">Select Site:</label>
                            <select
                                className="form-select"
                                onChange={(e) => handleSiteChange(e.target.value)}
                                aria-label="Select Site"
                                style={{ fontSize: "1.2rem" }}
                            >
                                <option value="">-- Select a Site --</option>
                                {sites.map(site => (
                                    <option key={site._id} value={site._id}>{site.site_address} ({site.status})</option>
                                ))}
                            </select>
                        </div>

                        {/* Employee List */}
                        {selectedSite ? (
                            employees.length > 0 ? (
                                employees.map((category, index) => (
                                    category.employees.length > 0 && (
                                        <div key={index} className="mb-4 p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "10px" }}>
                                            <h4 className="text-white" style={{ fontSize: "1rem" }}>{category.category}</h4>
                                            {category.employees.map((emp) => (
                                                <div key={emp._id} className="d-flex justify-content-between align-items-center bg-light p-3 rounded mb-2">
                                                    <span style={{ fontSize: "1.1rem" }}>{emp.name}</span>
                                                    <div>
                                                        <button
                                                            className={`btn ${attendance[emp._id] === "Present" ? "btn-success" : "btn-secondary"} me-2`}
                                                            onClick={() => handleAttendanceChange(emp._id, "Present")}
                                                            style={{ fontSize: "1.1rem" }}
                                                        >
                                                            <FaCheckCircle /> Present
                                                        </button>
                                                        <button
                                                            className={`btn ${attendance[emp._id] === "Absent" ? "btn-danger" : "btn-secondary"} me-2`}
                                                            onClick={() => handleAttendanceChange(emp._id, "Absent")}
                                                            style={{ fontSize: "1.1rem" }}
                                                        >
                                                            <FaTimesCircle /> Absent
                                                        </button>
                                                        <button
                                                            className={`btn ${attendance[emp._id] === "Leave" ? "btn-warning" : "btn-secondary"} me-2`}
                                                            onClick={() => handleAttendanceChange(emp._id, "Leave")}
                                                            style={{ fontSize: "1.1rem" }}
                                                        >
                                                            <FaUserClock /> Leave
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleReviewAttendance(emp._id, siteId)}
                                                            style={{ fontSize: "1.1rem" }}
                                                        >
                                                            <FaEye /> Review Attendance
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))
                            ) : (
                                <div className="mb-4 p-3" style={{ background: "rgba(255, 255, 255, 0.1)", borderRadius: "10px" }}>
                                    <p className="text-white">⚠️ No employees assigned to this site.</p>
                                </div>
                            )
                        ) : null}

                        {/* Submit Button */}
                        {selectedSite && employees.length > 0 && (
                            <button className="btn btn-success mt-3" onClick={handleSubmitAttendance} style={{ fontSize: "1.2rem" }}>
                                Submit Attendance
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
