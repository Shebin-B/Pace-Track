import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmpRegistration = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [category, setCategory] = useState("");
    const [salary, setSalary] = useState("");
    const [image, setImage] = useState(null);
    const [idProof, setIdProof] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let errors = {};
        const nameRegex = /^[a-zA-Z\s]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!name.trim()) errors.name = "Name is required";
        else if (!nameRegex.test(name)) errors.name = "Name should contain only alphabets";

        if (!phone.trim()) errors.phone = "Phone number is required";
        else if (!phoneRegex.test(phone)) errors.phone = "Enter a valid 10-digit phone number";

        if (!email.trim()) errors.email = "Email is required";
        else if (!emailRegex.test(email)) errors.email = "Enter a valid email address";

        if (!address.trim()) errors.address = "Address is required";
        else if (address.length < 5) errors.address = "Address must be at least 5 characters long";

        if (!category) errors.category = "Please select a category";

        if (!salary.trim()) errors.salary = "Salary is required";
        else if (isNaN(salary) || Number(salary) <= 0) errors.salary = "Enter a valid salary";

        if (!image) errors.image = "Profile image is required";
        if (!idProof) errors.idProof = "ID proof is required";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;

        if (!file) return;

        if (name === "image" && !file.type.startsWith("image/")) {
            setErrorMsg("Profile image must be an image file.");
            return;
        }

        if (name === "idProof" && !(file.type.startsWith("image/") || file.type === "application/pdf")) {
            setErrorMsg("ID proof must be an image or PDF file.");
            return;
        }

        if (name === "image") setImage(file);
        if (name === "idProof") setIdProof(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrorMsg("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("address", address);
        formData.append("email", email);
        formData.append("work_category", category);
        formData.append("salary", salary);
        formData.append("image", image);
        formData.append("idProof", idProof);

        try {
            const response = await axios.post("http://localhost:5004/api/empregister/createemployee", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response.data);
            alert(`${name} has been registered successfully`);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            console.error("Axios error:", err);
            setErrorMsg(err.response?.status === 409 ? "Email already exists." : "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: "#fff" }}>
            <div className="card p-4 shadow-lg" style={{ maxWidth: "450px", width: "100%", borderRadius: "16px", boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)", padding: "25px" }}>
                <h2 className="text-center mb-3" style={{ color: "#222", fontWeight: "bold", fontSize: "22px" }}>
                    Employee Registration
                </h2>

                {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <input type="text" className="form-control rounded-pill" value={name}
                            onChange={(e) => setName(e.target.value)} placeholder="Enter full name" />
                        {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Phone</label>
                        <input type="tel" className="form-control rounded-pill" value={phone}
                            onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                        {errors.phone && <div className="text-danger">{errors.phone}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <textarea className="form-control rounded-3" rows="2" value={address}
                            onChange={(e) => setAddress(e.target.value)} placeholder="Enter address" />
                        {errors.address && <div className="text-danger">{errors.address}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Email</label>
                        <input type="email" className="form-control rounded-pill" value={email}
                            onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                        {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Category</label>
                        <select className="form-select rounded-pill" required value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="" disabled>Select category</option>
                            <option value="Carpenter">Carpenter</option>
                            <option value="Mason">Mason</option>
                            <option value="Tiler">Tiler</option>
                            <option value="Plasterer">Plasterer</option>
                            <option value="Painter">Painter</option>
                            <option value="Plumber">Plumber</option>
                            <option value="Electrician">Electrician</option>
                            <option value="HVAC Technician">HVAC Technician</option>
                            <option value="Fire Sprinkler Technician">Fire Sprinkler Technician</option>
                            <option value="Welder">Welder</option>
                            <option value="Steel Fixer">Steel Fixer</option>
                            <option value="Concrete Finisher">Concrete Finisher</option>
                            <option value="Scaffolder">Scaffolder</option>
                            <option value="Roofer">Roofer</option>
                            <option value="Glazier">Glazier</option>
                            <option value="Insulation Worker">Insulation Worker</option>
                            <option value="Driller">Driller</option>
                        </select>
                        {errors.category && <small className="text-danger">{errors.category}</small>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Salary</label>
                        <input type="text" className="form-control rounded-pill" value={salary}
                            onChange={(e) => setSalary(e.target.value)} placeholder="Enter salary" />
                        {errors.salary && <div className="text-danger">{errors.salary}</div>}
                    </div>

                    {/* Profile Image */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Profile Image</label>
                        <input type="file" className="form-control" name="image" accept="image/*"
                            onChange={handleFileChange} />
                        {errors.image && <div className="text-danger">{errors.image}</div>}
                    </div>

                    {/* ID Proof */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">ID Proof (Image or PDF)</label>
                        <input type="file" className="form-control" name="idProof" accept="image/*,application/pdf"
                            onChange={handleFileChange} />
                        {errors.idProof && <div className="text-danger">{errors.idProof}</div>}
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
                </form>
            </div>
        </div>
    );
};

export default EmpRegistration;
