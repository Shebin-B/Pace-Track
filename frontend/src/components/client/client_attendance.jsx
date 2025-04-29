import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaEye } from "react-icons/fa";

const ClientAttendance = () => {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();
    const { clientId } = useParams(); // ✅ Corrected from managerId to clientId

    // ✅ Fetch assigned sites for the client
    useEffect(() => {
        if (clientId) {
            axios.get(`http://localhost:5004/api/clients/clientsites/${clientId}`)
                .then(res => setSites(res.data))
                .catch(err => console.error("Error fetching assigned sites:", err));
        }
    }, [clientId]);

    // ✅ Handle site selection & fetch employees
    const handleSiteChange = (siteId) => {
        console.log("Site selected:", siteId);
        setSelectedSite(siteId);

        axios.get(`http://localhost:5004/api/attendence/employees/${siteId}`)
            .then(res => {
                setEmployees(res.data);
            })
            .catch(err => console.error("Error fetching employees:", err));
    };
        
    // ✅ Navigate to review attendance
    const handleReviewAttendance = (employeeId) => {
        if (!employeeId || !selectedSite) {
            console.error("Error: Employee ID or Site ID is missing!");
            return;
        }
        navigate(`/attendancereview/${employeeId}/${selectedSite}`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div style={styles.main}>

                    {/* Header */}
                    <div style={styles.header}>
                        Client Attendance Dashboard
                    </div>

                    {/* Site Selection Dropdown */}
                    <div style={styles.content}>
                        <div style={styles.dropdownContainer}>
                            <label style={styles.label}>Select Site:</label>
                            <select
                                style={styles.dropdown}
                                onChange={(e) => handleSiteChange(e.target.value)}
                                aria-label="Select Site"
                            >
                                <option value="">-- Select a Site --</option>
                                {sites.map(site => (
                                    <option key={site._id} value={site._id}>{site.site_address} ({site.status})</option>
                                ))}
                            </select>
                        </div>

                        {/* Employee List */}
                        {selectedSite && (
                            employees.length > 0 ? (
                                employees.map((category, index) => (
                                    category.employees.length > 0 && (
                                        <div key={index} style={styles.categoryBox}>
                                            <h4 style={styles.categoryTitle}>{category.category}</h4>
                                            {category.employees.map((emp) => (
                                                <div key={emp._id} style={styles.employeeCard}>
                                                    <span style={styles.employeeName}>{emp.name}</span>
                                                    <button
                                                        style={styles.reviewButton}
                                                        onClick={() => handleReviewAttendance(emp._id)}
                                                    >
                                                        <FaEye />   Review Attendance
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ))
                            ) : (
                                <div style={styles.noEmployees}>⚠️ No employees assigned to this site.</div>
                            )
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

/* ✅ INLINE CSS */
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to right, #1c1c1c, #2c3e50)",
        padding: 0,
        margin: 0,
    },
    row: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    main: {
        width: "100%",
        maxWidth: "900px",
        padding: "20px",
        marginBottom:"233px"
    },
    header: {
        textAlign: "center",
        color: "#fff",
        fontSize: "30px",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: "20px",
    },
    content: {
        padding: "20px",
    },
    dropdownContainer: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        color: "#fff",
        fontSize: "22px",
        marginBottom: "5px",
    },
    dropdown: {
        width: "100%",
        padding: "10px",
        fontSize: "20px",
        borderRadius: "5px",
        border: "none",
        outline: "none",
    },
    categoryBox: {
        background: "rgba(255, 255, 255, 0.1)",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px",
    },
    categoryTitle: {
        color: "#fff",
        fontSize: "22px",
        marginBottom: "10px",
    },
    employeeCard: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f8f9fa",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
    },
    employeeName: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    reviewButton: {
        background: "#007bff",
        color: "#fff",
        border: "none",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
    },
    reviewButtonHover: {
        background: "#0056b3",
    },
    noEmployees: {
        color: "#fff",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.1)",
        padding: "10px",
        borderRadius: "10px",
    },
};

export default ClientAttendance;
