import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SupervisorRegistration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");  
    const navigate = useNavigate();

    // Validation patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const nameRegex = /^[A-Za-z\s]+$/;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;

        if (!file) return;

        if (name === "image" && !file.type.startsWith("image/")) {
            setError("Profile image must be an image file.");
            return;
        }

        if (name === "idProof" && !(file.type.startsWith("image/") || file.type === "application/pdf")) {
            setError("ID proof must be an image or PDF file.");
            return;
        }

        if (name === "image") setImage(file);
        if (name === "idProof") setIdProof(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!name || !email || !address || !phone || !password || !image || !idProof) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        if (!nameRegex.test(name)) {
            setError("Name can only contain letters and spaces.");
            setLoading(false);
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Please enter a valid email.");
            setLoading(false);
            return;
        }

        if (!phoneRegex.test(phone)) {
            setError("Phone number must be 10 digits.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("image", image);
        formData.append("idProof", idProof);

        try {
            await axios.post("http://localhost:5004/api/supervisorregister/Createsupervisor", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert(`${name} has been registered successfully`);
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.status === 409 ? "Email already exists." : "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#f8f9fa" }}>
            <div className="card p-4 shadow-lg"
                style={{
                    maxWidth: "450px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(12px)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                    padding: "25px",
                }}>
                <h2 className="text-center mb-3" style={{ color: "#222", fontWeight: "bold", fontSize: "24px" }}>
                    Supervisor Registration
                </h2>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <input type="text" className="form-control rounded-pill" required 
                            onChange={(e) => setName(e.target.value)} value={name} 
                            placeholder="Enter your full name" />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input type="tel" className="form-control rounded-pill" required 
                            onChange={(e) => setPhone(e.target.value)} value={phone} 
                            placeholder="Enter phone number" />
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <textarea className="form-control rounded-3" rows="2" required 
                            onChange={(e) => setAddress(e.target.value)} value={address} 
                            placeholder="Enter address"></textarea>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control rounded-pill" required 
                            onChange={(e) => setEmail(e.target.value)} value={email} 
                            placeholder="Enter email" />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Password</label>
                        <input type="password" className="form-control rounded-pill" required 
                            onChange={(e) => setPassword(e.target.value)} value={password} 
                            placeholder="Enter password" />
                    </div>

                    {/* Profile Image */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Profile Image</label>
                        <input type="file" className="form-control" required accept="image/*"
                            name="image" onChange={handleFileChange} />
                    </div>

                    {/* ID Proof */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">ID Proof (Image or PDF)</label>
                        <input type="file" className="form-control" required accept="image/*,application/pdf"
                            name="idProof" onChange={handleFileChange} />
                    </div>

                    {/* T&C Checkbox */}
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" required />
                        <label className="form-check-label">
                            I agree to the <a href="#" style={{ textDecoration: "none", color: "#2575fc" }}>Terms & Conditions</a>
                        </label>
                    </div>

                    <button type="submit" className="btn w-100 py-2 rounded-pill"
                        disabled={loading}
                        style={{
                            background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "bold",
                            border: "none",
                            transition: "0.3s",
                        }}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <button type="button" className="btn btn-outline-dark mt-3 w-100 rounded-pill"
                        onClick={() => window.history.back()} 
                        style={{ fontSize: "16px", fontWeight: "bold", border: "2px solid black", transition: "0.3s" }}>
                        Back
                    </button>

                    <div className="text-center mt-3">
                        <p>Already have an account? <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold", color: "#6a11cb" }}>Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupervisorRegistration;
