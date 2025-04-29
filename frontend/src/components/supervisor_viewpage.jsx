import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import { FaUsers, FaSearch, FaUserCheck, FaUserTimes, FaClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./navbaradm";

const SupervisorPage = () => {
    const [supervisors, setSupervisors] = useState([]);
    const [filteredSupervisor, setFilteredSupervisors] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupervisors = async () => {
            try {
                const response = await axios.get("http://localhost:5004/api/supervisorregister/Getsupervisor");
                setSupervisors(response.data);
            } catch (error) {
                console.error("Error fetching supervisors:", error);
            }
        };
        fetchSupervisors();
    }, []);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setSearchTerm("");
        setFilterStatus("");
        setFilteredSupervisors([]);
        if (!showSearch) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    };

    const performSearch = () => {
        if (searchTerm.trim() === "") {
            setFilteredSupervisors([]);
            return;
        }
        const results = supervisors.filter(supervisor =>
            supervisor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSupervisors(results);
    };

    const filterByStatus = (status) => {
        setFilterStatus(status);
        setSearchTerm("");
        if (status === "") {
            setFilteredSupervisors([]);
        } else {
            const results = supervisors.filter(supervisor => 
                supervisor.status && supervisor.status.toLowerCase() === status.toLowerCase()
            );
            setFilteredSupervisors(results);
        }
    };

    return (
        <>
            <NavBar />
            <div className="main-container">
                <div className="icon-grid">
                    <div className="icon-box" onClick={() => navigate("/viewsupervisor")}>
                        <FaUsers size={50} />
                        <span>View Supervisors</span>
                    </div>

                    <div className="icon-box" onClick={toggleSearch}>
                        <FaSearch size={50} />
                        <span>Search Supervisors</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Approved")}>
                        <FaUserCheck size={50} />
                        <span>Approved Supervisors</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Rejected")}>
                        <FaUserTimes size={50} />
                        <span>Rejected Supervisors</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Pending")}>
                        <FaClock size={50} />
                        <span>Pending Supervisors</span>
                    </div>
                </div>

                {showSearch && (
                    <InputGroup className="search-bar">
                        <Form.Control
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            ref={inputRef}
                        />
                        <Button variant="primary" onClick={performSearch}>
                            <FaSearch />
                        </Button>
                    </InputGroup>
                )}

                {filteredSupervisor.length > 0 && (
                    <div className="client-list">
                        <h3>{filterStatus ? `${filterStatus} supervisor` : "Search Results"} ({filteredSupervisor.length})</h3>
                        {filteredSupervisor.map(supervisor => (
                            <Card key={supervisor._id} className="client-card">
                                <Card.Body>
                                    <Card.Title>{supervisor.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{supervisor.email}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Phone:</strong> {supervisor.phone} <br />
                                        <strong>Address:</strong> {supervisor.address} <br />
                                        <strong>Status:</strong> {supervisor.status}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredSupervisor.length === 0 && (searchTerm || filterStatus) && (
                    <p className="no-results">No Supervisors found.</p>
                )}
            </div>

            {/* Add CSS */}
            <style>{`
    .main-container {
        background: linear-gradient(to right, #02022b, #410202);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow: auto;
    }
    .icon-grid {
        display: flex;
        gap: 90px; /* Increased spacing between icons */
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 30px;
    }
    .icon-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 150px;  /* Increased box size */
        height: 150px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.3s, background 0.3s;
        text-align: center;
        color: white;
        font-size: 16px; /* Bigger text */
        padding: 15px;
        box-shadow: 0px 5px 15px rgba(255, 255, 255, 0.2);
    }
    .icon-box:hover {
        transform: scale(1.1); /* Increased hover effect */
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0px 10px 20px rgba(255, 255, 255, 0.17);
    }
    .icon-box span {
        margin-top: 10px; /* More spacing below icons */
        font-weight: bold;
    }
    .icon-box svg {
        font-size: 70px; /* Bigger icons */
    }
    .search-bar {
        width: 50%;
        margin: 20px auto;
        display: flex;
        align-items: center;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 25px; /* More rounded */
        padding: 10px;
        box-shadow: 0px 5px 10px rgba(255, 255, 255, 0.3);
    }
    .search-bar input {
        border-radius: 20px;
        padding: 10px;
        font-size: 16px;
    }
    .client-list {
        width: 70%;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0px 5px 10px rgba(255, 255, 255, 0.2);
        margin-top: 20px;
        color: white;
    }
    .client-card {
        background: rgba(255, 255, 255, 0.2) !important;
        margin-bottom: 15px;
        border-radius: 10px;
        box-shadow: 0px 5px 10px rgba(255, 255, 255, 0.3);
        color: white;
    }
    .no-results {
        color: white;
        font-size: 18px;
        margin-top: 20px;
    }
`}</style>

        </>
    );
};

export default SupervisorPage;
