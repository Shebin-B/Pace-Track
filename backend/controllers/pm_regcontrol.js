const Pm_register=require("../models/pm_regmodel");
const site_regmodel=require("../models/site_regmodel")
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const jwtSecretKey="shebin123"


const Createmanager = async (req, res) => {
    try {
        const { name, phone, address, email, password } = req.body;

        // Validate required fields
        if (!name || !phone || !address || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const manager = await Pm_register.findOne({ email: email });

        if (manager) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Extract files from Multer
        const profileImage = req.files?.image?.[0] || null;
        const idProofFile = req.files?.idProof?.[0] || null;

        await Pm_register.create({
            name,
            phone,
            address,
            email,
            password: hashedPassword,
            status: "Pending",
            image: profileImage ? {
                data: profileImage.buffer,
                contentType: profileImage.mimetype
            } : null,
            idProof: idProofFile ? {
                data: idProofFile.buffer,
                contentType: idProofFile.mimetype
            } : null
        });

        res.json({ success: true, message: "Project Manager registered successfully" });

    } catch (error) {
        console.error("Error in Createmanager:", error);
        return res.status(500).json({ success: false, msg: "An error occurred" });
    }
};



// Fetch All Clients
// Fetch All Project Managers
const Getmanager = async (req, res) => {
    try {
        const managers = await Pm_register.find({}, { password: 0 }); // Exclude password

        if (!managers || managers.length === 0) {
            return res.status(404).json({ success: false, msg: "No managers found" });
        }

        // Convert Binary Data to Base64 Format
        const updatedManagers = managers.map(manager => ({
            ...manager._doc,
            image: manager.image?.data 
                ? `data:${manager.image.contentType};base64,${manager.image.data.toString("base64")}` 
                : null,
            idProof: manager.idProof?.data 
                ? `data:${manager.idProof.contentType};base64,${manager.idProof.data.toString("base64")}` 
                : null
        }));

        res.json(updatedManagers);
    } catch (error) {
        console.error("Error fetching managers:", error);
        return res.status(500).json({ success: false, msg: "An error occurred while fetching managers" });
    }
};



const Deletemanager = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await Pm_register.findByIdAndDelete(id);
        if (!manager) {
            return res.status(404).json({ success: false, msg: "Manager not found" });
        }
        res.json({ success: true, message: "Manager deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error deleting manager" });
    }
};



const { sendManagerApprovalEmail, sendManagerRejectionEmail } = require("../controllers/mailer"); // Import the necessary email functions

const updateManagerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find and update the Project Manager's status
        const manager = await Pm_register.findByIdAndUpdate(
            id, 
            { status: status }, 
            { new: true }
        );

        // If the manager is not found, return an error
        if (!manager) {
            return res.status(404).json({ success: false, msg: "Manager not found" });
        }

        // 👉 After updating the status, send an email based on whether the manager is approved or rejected
        if (status === "Approved") {
            // Send approval email
            await sendManagerApprovalEmail(manager.email, manager.name);
        } else if (status === "Rejected") {
            // Send rejection email
            await sendManagerRejectionEmail(manager.email, manager.name);
        }

        // Return success response with updated manager data
        res.status(200).json({ success: true, data: manager, msg: "Manager status updated successfully." });
    } catch (error) {
        console.error("Error updating manager status:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const GetSitesByManager = async (req, res) => {
    try {
        const { managerId } = req.params;

        const sites = await Site_reg.find({ project_manager: managerId })
            .populate("client_Id", "name")  // Populate client name
            .populate("project_manager", "name email"); // Populate manager details

        if (!sites || sites.length === 0) {
            return res.status(404).json({ success: false, msg: "No sites assigned to this manager" });
        }

        res.json(sites);
    } catch (error) {
        console.error("Error fetching sites for manager:", error);
        res.status(500).json({ success: false, msg: "An error occurred while fetching sites" });
    }
};


module.exports={
    Createmanager,
    Deletemanager,
    Getmanager,
    updateManagerStatus,
    GetSitesByManager
}