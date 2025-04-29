import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReportPage = () => {
  const { employeeId, siteId } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [siteName, setSiteName] = useState('Loading...');
  const backendBaseUrl = "http://localhost:5004";

  useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/site/${siteId}`);
        if (!response.ok) throw new Error("Site not found");

        const data = await response.json();
        setSiteName(data.site_address);
      } catch (error) {
        setSiteName("Error fetching site");
      }
    };

    fetchSiteName();
  }, [siteId]);

  const handleDownload = async (type) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates!");
      return;
    }

    try {
      const reportUrl = `${backendBaseUrl}/reports/report/employee/${employeeId}/site/${siteId}/range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&type=${type}`;
      const response = await fetch(reportUrl);

      if (!response.ok) {
        if (response.status === 404) {
          alert("No attendance records found for the selected date range.");
        } else {
          throw new Error(`Failed to download ${type} report`);
        }
        return;
      }

      window.open(reportUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Employee Report</h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Start Date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={e => setStartDate(e.target.value)} 
            style={styles.input} 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>End Date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={e => setEndDate(e.target.value)} 
            style={styles.input} 
          />
        </div>

        <button 
          onClick={() => handleDownload('pdf')} 
          disabled={!startDate || !endDate} 
          style={{ ...styles.button, backgroundColor: (!startDate || !endDate) ? '#ccc' : '#007bff' }}
        >
          Download PDF
        </button>

        <button 
          onClick={() => handleDownload('excel')} 
          disabled={!startDate || !endDate} 
          style={{ ...styles.button, backgroundColor: (!startDate || !endDate) ? '#ccc' : '#28a745' }}
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    width: '320px'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default ReportPage;
