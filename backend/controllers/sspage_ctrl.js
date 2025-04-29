const mongoose = require("mongoose");
const Supervisor = require('../models/sitesupervisor_model')
const Site = require("../models/site_regmodel");
const Client = require("../models/client_regmodel");

exports.getSupervisorById = async (req, res) => {
    const supervisorId = req.params.id;
    console.log("Received Supervisor ID:", supervisorId);

    try {
        if (!mongoose.Types.ObjectId.isValid(supervisorId)) {
            return res.status(400).json({ message: "Invalid Supervisor ID format" });
        }

        const supervisor = await Supervisor.findById(supervisorId);
        if (!supervisor) {
            return res.status(404).json({ message: 'Supervisor not found' });
        }
        res.status(200).json(supervisor);
    } catch (error) {
        console.error('Error fetching Supervisor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getSupervisorSites = async (req, res) => {
    try {
        const { siteSupervisorId } = req.params;
        console.log("Fetching sites for supervisor:", siteSupervisorId);

        // Validate Supervisor ID format
        if (!mongoose.Types.ObjectId.isValid(siteSupervisorId)) {
            return res.status(400).json({ message: "Invalid Supervisor ID format" });
        }

        // Fetch sites assigned to the given Site Supervisor
        const sites = await Site.find({ supervisor: new mongoose.Types.ObjectId(siteSupervisorId) })
            .populate("client_Id", "name email")
            .populate("supervisor", "name email")
            .populate("project_manager", "name email"); // ✅ Added Project Manager

        console.log("Sites found:", sites);

        if (!sites || sites.length === 0) {
            return res.status(404).json({ message: "No sites found for this supervisor" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("Error fetching supervisor sites:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getClientDetails = async (req, res) => {
    const clientId = req.params.id;
    console.log("Fetching client details for ID:", clientId);

    try {
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: "Invalid Client ID format" });
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
