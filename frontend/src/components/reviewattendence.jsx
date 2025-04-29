import React, { useState, useEffect } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import axios from "axios";

const ReviewAttendance = () => {
    const { employeeId, siteId } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    // Get employeeId and siteId from URL params
    const [employee, setEmployee] = useState(null);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [monthlyAttendance, setMonthlyAttendance] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("today");
    const [attendanceSummary, setAttendanceSummary] = useState({ present: 0, absent: 0, leave: 0 });
    const [totalSalary, setTotalSalary] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        if (employeeId && siteId) {
            fetchEmployeeDetails();
            fetchTodaysAttendance();
        }
    }, [employeeId, siteId]);

    useEffect(() => {
        if (viewMode === "monthly" && employeeId && siteId) {
            fetchMonthlyAttendance();
        }
    }, [viewMode, year, month, employeeId, siteId]);

    const fetchEmployeeDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5004/api/empregister/Getemployeebyid/${employeeId}`);
            setEmployee(res.data.employee);
        } catch (error) {
            setError("Error fetching employee details");
        }
    };
    const handleGenerateReport = () => {
        navigate(`/sitewisereport/${employeeId}/${siteId}`);
      };
      

    const fetchTodaysAttendance = async () => {
        try {
            const res = await axios.get(`http://localhost:5004/api/attendence/today/${employeeId}/${siteId}`);
            setTodayAttendance(res.data.attendance || null);
        } catch (error) {
            setError("Error fetching today's attendance");
            setTodayAttendance(null);
        }
    };

    const fetchMonthlyAttendance = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5004/api/attendence/monthly/${employeeId}/${siteId}?year=${year}&month=${month}`);
            setMonthlyAttendance(res.data.attendances);
            calculateAttendanceSummary(res.data.attendances);
        } catch (error) {
            setMonthlyAttendance([]);
            setAttendanceSummary({ present: 0, absent: 0, leave: 0 });
        }
        setLoading(false);
    };

    const calculateAttendanceSummary = (data) => {
        const summary = { present: 0, absent: 0, leave: 0 };
        data.forEach((att) => {
            if (att.status === "Present") summary.present += 1;
            else if (att.status === "Absent") summary.absent += 1;
            else if (att.status === "Leave") summary.leave += 1;
        });
        setAttendanceSummary(summary);

        if (employee && employee.salary) {
            setTotalSalary(summary.present * employee.salary);
        } else {
            setTotalSalary(0);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={{ color: "white" }}>Review Attendance</h2>

            {employee && (
                <div style={styles.employeeDetailsContainer}>
                    <h3 style={styles.employeeName}>Employee: {employee.name}</h3>
                    <p><strong>Work Category:</strong> {employee.work_category}</p>
                    <p><strong>Daily Salary:</strong> ₹{employee.salary}</p>
                </div>
            )}

            <div style={styles.buttonContainer}>
                <button
                    style={viewMode === "today" ? styles.activeButton : styles.button}
                    onClick={() => setViewMode("today")}
                >
                    Today's Attendance
                </button>
                <button
                    style={viewMode === "monthly" ? styles.activeButton : styles.button}
                    onClick={() => setViewMode("monthly")}
                >
                    Monthly Attendance
                </button>
            </div>

            {viewMode === "today" && (
                <div style={styles.tableContainer}>
                    <h4>Today's Attendance</h4>
                    {todayAttendance ? (
                        <p style={{ fontSize: "20px" }}><strong>Status:</strong> {todayAttendance.status}</p>
                    ) : (
                        <p>No attendance marked for today.</p>
                    )}
                </div>
            )}

            {viewMode === "monthly" && (
                <div style={styles.tableContainer}>
                    <h4>Monthly Attendance</h4>
                    <div style={styles.inputContainer}>
                        <select style={styles.input} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>

                        <select style={styles.input} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <option key={m} value={m}>{new Date(2025, m - 1).toLocaleString('en', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? <p style={styles.loadingText}>Loading...</p> : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyAttendance.length > 0 ? (
                                    monthlyAttendance.map((att) => (
                                        <tr key={att._id}>
                                            <td style={styles.td}>{new Date(att.date).toLocaleDateString()}</td>
                                            <td style={styles.td}><strong>{att.status}</strong></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={styles.td}>No attendance records found for this month.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    <div style={styles.summaryContainer}>
                        <p><strong>Present:</strong> {attendanceSummary.present}</p>
                        <p><strong>Absent:</strong> {attendanceSummary.absent}</p>
                        <p><strong>Leave:</strong> {attendanceSummary.leave}</p>
                    </div>

                    {/* Salary Calculator */}
                    <div style={styles.salaryContainer}>
                        <h4>Salary Calculation</h4>
                        <p><strong>Daily Salary:</strong> ₹{employee?.salary || 0}</p>
                        <p><strong>Total Present Days:</strong> {attendanceSummary.present}</p>
                        <h4 style={{ color: "#4CAF50" }}><strong>Total Salary:</strong> ₹{totalSalary}</h4>
                    </div>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            
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
        transition: "background-color 0.3s, transform 0.2s"
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = "#1565c0"}
    onMouseOut={(e) => e.target.style.backgroundColor = "#1976d2"}
    onMouseDown={(e) => e.target.style.transform = "scale(0.98)"}
    onMouseUp={(e) => e.target.style.transform = "scale(1)"}
>
    ⬅ Go Back
</button>
<button 
  onClick={handleGenerateReport} 
  style={{
    width: '10%', 
    padding: '10px', 
    marginBottom: '10px', 
    backgroundColor: 'green', 
    color: '#fff', 
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none', 
    borderRadius: '4px', 
    cursor: 'pointer', 
    transition: 'background 0.3s ease-in-out'
  }}
  onMouseOver={(e) => e.target.style.backgroundColor = '#138496'}
  onMouseOut={(e) => e.target.style.backgroundColor = '#17a2b8'}
>
  Generate Report
</button>

        </div>
    );
};

const styles = {
    container: { 
        minHeight: "100vh", 
        background: "linear-gradient(to right, #1c1c1c, #2c3e50)", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        padding: "20px", 
        color: "#fff", 
        fontFamily: "Arial, sans-serif" 
    },
    employeeDetailsContainer: { 
        background: "rgba(255, 255, 255, 0.1)", 
        padding: "20px", 
        borderRadius: "15px", 
        textAlign: "center", 
        width: "80%", 
        marginBottom: "20px" 
    },
    employeeName: { 
        fontSize: "32px", 
        color: "#ffcc00", 
        fontWeight: "bold" 
    },
    loadingText: { 
        fontSize: "22px", 
        color: "#fff", 
        marginBottom: "20px" 
    },
    buttonContainer: { 
        display: "flex", 
        gap: "20px", 
        marginBottom: "20px" 
    },
    button: { 
        padding: "12px 20px", 
        fontSize: "18px", 
        background: "transparent", 
        border: "2px solid #ffcc00", 
        borderRadius: "10px", 
        cursor: "pointer", 
        color: "#fff", 
        transition: "0.3s" 
    },
    activeButton: { 
        padding: "12px 20px", 
        fontSize: "18px", 
        background: "#ffcc00", 
        border: "2px solid #ffcc00", 
        borderRadius: "10px", 
        color: "#000", 
        cursor: "pointer" 
    },
    inputContainer: { 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px" 
    },
    input: { 
        padding: "12px", 
        borderRadius: "5px", 
        width: "100px", 
        fontSize: "16px", 
        border: "1px solid #ffcc00", 
        background: "#333", 
        color: "#fff" 
    },
    tableContainer: { 
        width: "80%", 
        borderRadius: "10px", 
        background: "rgba(255, 255, 255, 0.1)", 
        padding: "20px", 
        marginBottom: "20px" 
    },
    table: { 
        width: "100%", 
        borderCollapse: "collapse" 
    },
    th: { 
        background: "#ffcc00", 
        color: "#000", 
        padding: "12px", 
        textAlign: "left", 
        fontSize: "18px" 
    },
    td: { 
        padding: "12px", 
        color: "#fff", 
        fontSize: "18px" 
    },
    summaryContainer: { 
        marginTop: "20px", 
        background: "rgba(255, 255, 255, 0.1)", 
        padding: "10px", 
        borderRadius: "10px" 
    }
};


export default ReviewAttendance;
