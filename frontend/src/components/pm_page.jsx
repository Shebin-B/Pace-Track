import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, InputGroup, Card } from "react-bootstrap";
import { FaUsers, FaSearch, FaUserCheck, FaUserTimes, FaClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./navbaradm";

const Managerpage = () => {
    const [managers, setManagers] = useState([]);
    const [filteredmanagers, setfilteredmanagers] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchaManagers = async () => {
            try {
                const response = await axios.get("http://localhost:5004/api/managerregister/Getmanager");
                setManagers(response.data);
            } catch (error) {
                console.error("Error fetching managers:", error);
            }
        };
        fetchaManagers();
    }, []);

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setSearchTerm("");
        setFilterStatus("");
        setfilteredmanagers([]);
        if (!showSearch) {
            setTimeout(() => inputRef.current?.focus(), 200);
        }
    };

    const performSearch = () => {
        if (searchTerm.trim() === "") {
            setfilteredmanagers([]);
            return;
        }
        const results = managers.filter(manager =>
            manager.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setfilteredmanagers(results);
    };

    const filterByStatus = (status) => {
        setFilterStatus(status);
        setSearchTerm("");
        if (status === "") {
            setfilteredmanagers([]);
        } else {
            const results = managers.filter(manager => 
                manager.status && manager.status.toLowerCase() === status.toLowerCase()
            );
            setfilteredmanagers(results);
        }
    };

    return (
        <>
            <NavBar />
            <div className="main-container">
                <div className="icon-grid">
                    <div className="icon-box" onClick={() => navigate("/viewmanager")}>
                        <FaUsers size={50} />
                        <span>View Managers</span>
                    </div>

                    <div className="icon-box" onClick={toggleSearch}>
                        <FaSearch size={50} />
                        <span>Search Managers</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Approved")}>
                        <FaUserCheck size={50} />
                        <span>Approved Managers</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Rejected")}>
                        <FaUserTimes size={50} />
                        <span>Rejected Managers</span>
                    </div>

                    <div className="icon-box" onClick={() => filterByStatus("Pending")}>
                        <FaClock size={50} />
                        <span>Pending Managers</span>
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

                {filteredmanagers.length > 0 && (
                    <div className="manager-list">
                        <h3>{filterStatus ? `${filterStatus} Managers` : "Search Results"} ({filteredmanagers.length})</h3>
                        {filteredmanagers.map(manager => (
                            <Card key={manager._id} className="manager-card">
                                <Card.Body>
                                    <Card.Title>{manager.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{manager.email}</Card.Subtitle>
                                    <Card.Text>
                                        <strong>Phone:</strong> {manager.phone} <br />
                                        <strong>Address:</strong> {manager.address} <br />
                                        <strong>Status:</strong> {manager.status}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredmanagers.length === 0 && (searchTerm || filterStatus) && (
                    <p className="no-results">No managers found.</p>
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
        transform: scale(1.15); /* Increased hover effect */
        background: rgba(255, 255, 255, 0.2);
        box-shadow: 0px 10px 20px rgba(255, 255, 255, 0.3);
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
    .manager-list {
        width: 70%;
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0px 5px 10px rgba(255, 255, 255, 0.2);
        margin-top: 20px;
        color: white;
    }
    .manager-card {
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

export default Managerpage;
