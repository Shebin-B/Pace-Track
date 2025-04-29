import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";

const SiteRegistration = () => {
    const { id: clientId } = useParams();
    const [site_address, setSiteAddress] = useState("");
    const [total_cost, setTotalCost] = useState("");
    const [end_date, setEndDate] = useState("");
    const [status, setStatus] = useState("Pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // Error handling state
    const navigate = useNavigate();

    const validateCost = (cost) => {
        return !isNaN(cost) && cost > 0; // Validate if cost is a number and greater than 0
    };

    const validateEndDate = (endDate) => {
        return new Date(endDate) >= new Date(); // Ensure the end date is not in the past
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear any previous errors

        // Validation
        if (!validateCost(total_cost)) {
            setError("Please enter a valid cost.");
            setLoading(false);
            return;
        }

        if (!validateEndDate(end_date)) {
            setError("End date cannot be in the past.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost:5004/api/siteregister/Createsite", {
                client_Id: clientId,
                site_address,
                total_cost: Number(total_cost),
                end_date: new Date(end_date),
                status,
            });

            console.log(response.data);
            alert("Site Registered Successfully!");
         // Redirect after successful submission

            // Reset form fields after successful submission
            setSiteAddress("");
            setTotalCost("");
            setEndDate("");
            setStatus("Pending");
        } catch (error) {
            console.error("Axios error:", error);
            setError(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div
                className="card shadow-lg p-4"
                style={{
                    maxWidth: "500px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    color: "#000",
                }}
            >
                <h2 className="text-center mb-3" style={{ color: "#333", fontWeight: "bold" }}>
                    Register Work Site
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Error Message */}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Site Address */}
                    <div className="mb-3">
                        <label className="form-label fw-bold" htmlFor="siteAddress">
                            Site Address
                        </label>
                        <textarea
                            id="siteAddress"
                            className="form-control"
                            rows="2"
                            required
                            onChange={(e) => setSiteAddress(e.target.value)}
                            value={site_address}
                            style={{ border: "1px solid black", color: "black" }}
                        ></textarea>
                    </div>

                    {/* Total Cost */}
                    <div className="mb-3">
                        <label className="form-label fw-bold" htmlFor="totalCost">
                            Total Cost
                        </label>
                        <input
                            id="totalCost"
                            type="number"
                            className="form-control"
                            required
                            onChange={(e) => setTotalCost(e.target.value)}
                            value={total_cost}
                            style={{ border: "1px solid black", color: "black" }}
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-3">
                        <label className="form-label fw-bold" htmlFor="endDate">
                            End Date
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            className="form-control"
                            required
                            onChange={(e) => setEndDate(e.target.value)}
                            value={end_date}
                            style={{ border: "1px solid black", color: "black" }}
                        />
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                        <label className="form-label fw-bold" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            className="form-control"
                            required
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ border: "1px solid black", color: "black" }}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2"
                        disabled={loading}
                        style={{
                            backgroundColor: "rgb(3 2 80)",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "bold",
                            borderRadius: "8px",
                            border: "none",
                        }}
                    >
                        {loading ? "Registering..." : "Register Site"}
                    </button>
                </form>

                {/* Back Button */}
                <button
                    className="btn btn-secondary mt-3 w-100"
                    onClick={() => navigate(-1)} // Go back to previous page
                    style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        border: "none",
                    }}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default SiteRegistration;
