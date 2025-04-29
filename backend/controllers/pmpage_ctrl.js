const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const ProjectManager = require('../models/pm_regmodel'); // Adjust the path as necessary
const Client = require('../models/client_regmodel');
const Site_reg=require('../models/site_regmodel');

exports.getManagerById = async (req, res) => {
    console.log("Received manager ID:", req.params.id); // Debugging step

    try {
        const manager = await ProjectManager.findById(req.params.id);
        if (!manager) {
            return res.status(404).json({ message: 'Project Manager not found' });
        }
        res.json(manager);
    } catch (error) {
        console.error('Error fetching project manager:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getClientDetails = async (req, res) => {
    const clientId = req.params.id;
    console.log("Fetching client details for ID:", clientId);

    try {
        if (!ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "Invalid client ID" });
        }

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        return res.status(200).json(client);
    } catch (error) {
        console.error("Error fetching client details:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getManagerAssignedSites = async (req, res) => {
    try {
        const { managerId } = req.params; // ✅ Get Project Manager ID from request parameters
        console.log("Received Project Manager ID:", managerId); // ✅ Debugging log

        const sites = await Site_reg.find({ project_manager: managerId }) // ✅ Use the correct field
            .select("site_name site_address status");

        console.log("Fetched Sites for Project Manager:", sites); // ✅ Debugging log

        if (!sites.length) {
            return res.status(404).json({ error: "No sites assigned to this project manager" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("❌ Error fetching assigned sites:", error);
        res.status(500).json({ error: "Error fetching assigned sites" });
    }
};
