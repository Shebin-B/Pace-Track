const mongoose = require("mongoose");
const Client = require('../models/client_regmodel')
const Site = require("../models/site_regmodel");

exports.getClientById = async (req, res) => {
    console.log("Received client ID:", req.params.id); // Debugging step

    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getClientSites = async (req, res) => {
    try {
        const clientId = req.params.id;

        const sites = await Site.find({ client_Id: new mongoose.Types.ObjectId(clientId) })
            .populate("client_Id", "name email")
            .populate({
                path: "project_manager",
                select: "name email phone address"  // Explicitly selecting required fields
            })
            .populate("site_supervisor", "name email phone address");

        if (!sites || sites.length === 0) {
            return res.status(404).json({ message: "No sites found" });
        }

        res.json(sites);
    } catch (error) {
        console.error("Error fetching client sites:", error);
        res.status(500).json({ error: "Server Error" });
    }
};


exports.getClientSites = async (req, res) => {
    try {
        const { clientId } = req.params; // ✅ Get Client ID from request parameters
        console.log("Received Client ID:", clientId); // ✅ Debugging log

        const sites = await Site.find({ client_Id: clientId }) // ✅ Filter by client_Id
        .populate("supervisor", "name email phone") // ✅ Use correct field name
        .populate("project_manager", "name email phone") // ✅ Populate manager if needed
        .select("site_name site_address status total_cost end_date");

        console.log("Fetched Sites for Client:", sites); // ✅ Debugging log

        if (!sites.length) {
            return res.status(404).json({ error: "No sites assigned to this client" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("❌ Error fetching assigned sites for client:", error);
        res.status(500).json({ error: "Error fetching assigned sites for client" });
    }
};
