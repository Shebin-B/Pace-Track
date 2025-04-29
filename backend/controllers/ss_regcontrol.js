const Supervisor_register = require("../models/sitesupervisor_model");
const Site_reg = require("../models/site_regmodel");
const mongoose = require("mongoose");


const bcrypt = require("bcryptjs");

// Create Client
const Createsupervisor = async (req, res) => {
    try {
        const { name, phone, address, email, password } = req.body;

        if (!name || !phone || !address || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existing = await Supervisor_register.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Extract files from Multer
        const profileImage = req.files["image"] ? req.files["image"][0] : null;
        const idProofFile = req.files["idProof"] ? req.files["idProof"][0] : null;

        const supervisor = new Supervisor_register({
            name,
            phone,
            address,
            email,
            password: hashedPassword,
            status: "Pending", // optional: if you want to add verification status like Client
            image: profileImage ? { data: profileImage.buffer, contentType: profileImage.mimetype } : null,
            idProof: idProofFile ? { data: idProofFile.buffer, contentType: idProofFile.mimetype } : null,
        });

        await supervisor.save();

        res.status(201).json({ message: "Supervisor registered successfully" });

    } catch (err) {
        console.error("Supervisor registration error:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// Fetch All Clients
const Getsupervisor = async (req, res) => {
    try {
        const supervisors = await Supervisor_register.find({}, { password: 0 });

        // Convert Binary Data to Base64 Format
        const updatedSupervisors = supervisors.map(supervisor => ({
            ...supervisor._doc,
            image: supervisor.image?.data
                ? `data:${supervisor.image.contentType};base64,${supervisor.image.data.toString("base64")}`
                : null,
            idProof: supervisor.idProof?.data
                ? `data:${supervisor.idProof.contentType};base64,${supervisor.idProof.data.toString("base64")}`
                : null
        }));

        res.json(updatedSupervisors);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "An error occurred while fetching supervisors" });
    }
};

const Deletesupervisor = async (req, res) => {
    try {
        const { id } = req.params;
        const supervisor = await Supervisor_register.findByIdAndDelete(id);
        if (!supervisor) {
            return res.status(404).json({ success: false, msg: "Supervisor not found" });
        }
        res.json({ success: true, message: "Supervisor deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error deleting supervisor" });
    }
};



const { sendSupervisorApprovalEmail, sendSupervisorRejectionEmail } = require("../controllers/mailer"); // Import email functions

const updatesupervisorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find and update the Site Supervisor's status
        const supervisor = await Supervisor_register.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        // If the supervisor is not found, return an error
        if (!supervisor) {
            return res.status(404).json({ success: false, msg: "Supervisor not found" });
        }

        // 👉 After updating the status, send an email based on whether the supervisor is approved or rejected
        if (status === "Approved") {
            // Send approval email
            await sendSupervisorApprovalEmail(supervisor.email, supervisor.name);
        } else if (status === "Rejected") {
            // Send rejection email
            await sendSupervisorRejectionEmail(supervisor.email, supervisor.name);
        }

        // Return success response with updated supervisor data
        res.status(200).json({ success: true, data: supervisor, msg: "Supervisor status updated successfully." });
    } catch (error) {
        console.error("Error updating supervisor status:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const getSupervisorSites = async (req, res) => {
    try {
        console.log("Fetching sites for supervisor:", req.params.supervisorId);

        // Find all sites assigned to the given supervisor
        const sites = await Site_reg.find({ supervisor: req.params.supervisorId })
            .populate("client_Id", "name email")  // Include client details
            .populate("supervisor", "name email"); // Include supervisor details

        if (!sites.length) {
            return res.status(404).json({ message: "No sites found for this supervisor" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("Error fetching supervisor sites:", error);
        res.status(500).json({ message: "Server error" });
    }
};
const removeSupervisor = async (req, res) => {
    try {
        const { siteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: "Invalid Site ID" });
        }

        const updatedSite = await Site_reg.findByIdAndUpdate(
            siteId,
            { $unset: { supervisor: "" } }, // Remove the supervisor field
            { new: true }
        );

        if (!updatedSite) {
            return res.status(404).json({ message: "Site not found" });
        }

        res.status(200).json({ message: "Supervisor removed successfully", site: updatedSite });
    } catch (error) {
        console.error("Error removing supervisor:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};



module.exports = {
    Createsupervisor,
    Getsupervisor,
    Deletesupervisor,
    updatesupervisorStatus,
    removeSupervisor,getSupervisorSites
    
};
