import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';  // Import useParams
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap

const EmployeeReport = () => {
  const { employeeId } = useParams();  // Get employeeId from URL
  const [attendanceData, setAttendanceData] = useState([]);
  const [fromDate, setFromDate] = useState('2025-04-01');
  const [toDate, setToDate] = useState('2025-04-30');

  const fetchData = async () => {
    try {
      console.log(`Fetching data for employeeId: ${employeeId} from ${fromDate} to ${toDate}`);
  
      const response = await axios.get(`http://localhost:5004/api/attendance/report/${employeeId}`, {
        params: {
          from: fromDate,
          to: toDate
        }
      });

      if (response.data) {
        setAttendanceData(response.data.data);  // Set the fetched data into state
      }
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchData();  // Fetch data when the component mounts or when dates change
    }
  }, [employeeId, fromDate, toDate]);  // Re-fetch if employeeId or date range changes

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Attendance Report for Employee Abhiram</h1>

      {/* Date Range Picker */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">From:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">To:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Data Table */}
      <div className="table-responsive">
        {attendanceData.length > 0 ? (
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Site Address</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((attendance) => (
                <tr key={attendance._id}>
                  <td>{attendance.site ? attendance.site.site_address : "No site assigned"}</td>
                  <td>{new Date(attendance.date).toLocaleDateString()}</td>
                  <td>{attendance.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-warning">No attendance data found for the selected date range.</div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReport;
