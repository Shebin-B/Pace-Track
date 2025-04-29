const Site_reg = require("../models/site_regmodel");
const Client = require("../models/client_regmodel"); // Ensure the correct path
const Pm_register = require("../models/pm_regmodel");
const mongoose = require('mongoose');
const Employee_reg = require("../models/emp_regmodel");
const supervisor_reg=require("../models/sitesupervisor_model")

const Createsite = async (req, res) => {
    try {
        const { client_Id, site_address, total_cost, end_date, status } = req.body;

        // Validate required fields
        if (!client_Id || !site_address || !total_cost || !end_date) {
            return res.status(400).json({ error: "All fields are required, including client_Id" });
        }

        // Check if client_Id exists in Client collection
        const clientExists = await Client.findById(client_Id);
        if (!clientExists) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Validate end_date (should be in the future)
        if (new Date(end_date) <= new Date()) {
            return res.status(400).json({ error: "End date must be in the future" });
        }

        // Check if the site already exists
        const siteExists = await Site_reg.findOne({ site_address });
        if (siteExists) {
            return res.status(409).json({ error: "Project site already exists" });
        }

        // Create a new site entry
        const newSite = await Site_reg.create({
            client_Id,
            site_address,
            total_cost,
            end_date,
            status: status || "Pending" // Default to "Pending" if not provided
        });

        res.status(201).json({ message: "Site registered successfully", site: newSite });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ success: false, msg: "An error occurred" });
    }
};

// Fetch all sites
const getSites = async (req, res) => {
    try {
        const sites = await Site_reg.find()
            .populate("client_Id", "name email")  
            .populate("project_manager", "name email")
            .populate({
                path: "supervisor", 
                select: "name"
            });

        console.log("Sites API Response:", JSON.stringify(sites, null, 2));  // 🔍 Debugging
        res.status(200).json({ success: true, sites });
    } catch (error) {
        console.error("Error fetching sites:", error);
        res.status(500).json({ success: false, msg: "An error occurred while fetching sites." });
    }
};







const deleteSite = async (req, res) => {
    try {
        const { id } = req.params; // Get ID from request parameters
        if (!id) {
            return res.status(400).json({ message: "Site ID is required" });
        }

        const deletedSite = await Site_reg.findByIdAndDelete(id);

        if (!deletedSite) {
            return res.status(404).json({ message: "Site not found" });
        }

        res.status(200).json({ message: "Site deleted successfully" });
    } catch (error) {
        console.error("Error deleting site:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const assignProjectManager = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { siteId, projectManagerId } = req.body; // 🔹 Change 'managerId' to 'projectManagerId'

        if (!siteId || !projectManagerId) {
            return res.status(400).json({ success: false, msg: "Missing required fields" });
        }

        console.log("Finding site...");
        const site = await Site_reg.findById(siteId);
        if (!site) {
            return res.status(404).json({ success: false, msg: "Site not found" });
        }

        console.log("Finding manager...");
        const manager = await Pm_register.findById(projectManagerId);
        if (!manager) {
            return res.status(404).json({ success: false, msg: "Project Manager not found" });
        }

        console.log("Assigning manager...");
        site.project_manager = projectManagerId;
        await site.save();

        res.status(200).json({ success: true, msg: "Project Manager assigned successfully" });
    } catch (error) {
        console.error("Error assigning Project Manager:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

const assignSupervisor = async (req, res) => {
    try {
        console.log("Received request body:", req.body);

        const { siteId, supervisorId } = req.body;
        if (!siteId || !supervisorId) {
            return res.status(400).json({ success: false, msg: "Missing required fields" });
        }

        console.log("Finding site with ID:", siteId);
        const site = await Site_reg.findById(siteId);
        if (!site) {
            console.log("Site not found");
            return res.status(404).json({ success: false, msg: "Site not found" });
        }

        console.log("Finding supervisor with ID:", supervisorId);
        const supervisor = await supervisor_reg.findById(supervisorId);
        if (!supervisor) {
            console.log("Supervisor not found");
            return res.status(404).json({ success: false, msg: "Supervisor not found" });
        }

        console.log("Before update, site data:", site);

        // ✅ Use `populate` to return supervisor details in response
        const updatedSite = await Site_reg.findByIdAndUpdate(
            siteId,
            { $set: { supervisor: supervisorId } },
            { new: true }
        ).populate("supervisor", "name email"); // Include supervisor name & email

        if (!updatedSite) {
            console.log("Update failed, site not found");
            return res.status(404).json({ success: false, msg: "Site not found after update" });
        }

        console.log("After update, site data:", updatedSite);

        res.status(200).json({
            success: true,
            msg: "Site supervisor assigned successfully",
            site: updatedSite, // Send updated site details
        });
    } catch (error) {
        console.error("Error assigning site supervisor:", error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
};


const Getmanager = async (req, res) => {
    try {
        console.log("Fetching approved project managers...");

        // Fetch only project managers with status "approved"
        const managers = await Pm_register.find({ status: "Approved" });

        if (!managers.length) {
            console.log("No approved project managers found in the database.");
            return res.status(404).json({ message: "No approved project managers found" });
        }

        console.log("Approved Managers found:", managers);
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching approved managers:", error);
        res.status(500).json({ message: error.message });
    }
};


const Getsupervisor = async (req, res) => {
    try {
        console.log("Fetching approved site supervisors...");

        // Fetch only supervisors with status "approved"
        const supervisors = await supervisor_reg.find({ status: "Approved" });

        if (!supervisors.length) {
            console.log("No approved site supervisors found in the database.");
            return res.status(404).json({ message: "No approved site supervisors found" });
        }

        console.log("Approved Supervisors found:", supervisors);
        res.status(200).json(supervisors);
    } catch (error) {
        console.error("Error fetching approved supervisors:", error);
        res.status(500).json({ message: error.message });
    }
};



const getClientSites = async (req, res) => {
    try {
        console.log("Client ID:", req.params.clientId);
        const sites = await Site_reg.find({ client_Id: req.params.clientId })
            .populate("client_Id", "name email")
            .populate("project_manager", "name email"); // 🔹 Populate project manager details

        if (!sites.length) {
            return res.status(404).json({ message: "No sites found for this client" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("Error fetching client sites:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getManagerSites = async (req, res) => {
    try {
        console.log("Fetching sites for manager:", req.params.projectManagerId);

        // Find all sites assigned to the given project manager
        const sites = await Site_reg.find({ project_manager: req.params.projectManagerId })
            .populate("client_Id", "name email")  // Include client details
            .populate("project_manager", "name email"); // Include project manager details

        if (!sites.length) {
            return res.status(404).json({ message: "No sites found for this manager" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("Error fetching manager sites:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const removeManager = async (req, res) => {
    try {
        const { siteId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(siteId)) {
            return res.status(400).json({ message: "Invalid Site ID" });
        }

        const updatedSite = await Site_reg.findByIdAndUpdate(
            siteId,
            { $unset: { project_manager: "" } }, // Remove the manager field
            { new: true }
        );

        if (!updatedSite) {
            return res.status(404).json({ message: "Site not found" });
        }

        res.status(200).json({ message: "Manager removed successfully", site: updatedSite });
    } catch (error) {
        console.error("Error removing manager:", error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};




const assignEmployeeToSite = async (req, res) => {
    try {
        const { siteId, category, employeeIds } = req.body;

        if (!siteId || !category || !employeeIds || !employeeIds.length) {
            return res.status(400).json({ success: false, msg: "Missing required fields" });
        }

        // Check if site exists
        const site = await Site_reg.findById(siteId);
        if (!site) {
            return res.status(404).json({ success: false, msg: "Site not found" });
        }

        // Validate employee IDs
        const employees = await Employee_reg.find({ _id: { $in: employeeIds } });
        if (employees.length !== employeeIds.length) {
            return res.status(404).json({ success: false, msg: "One or more employees not found" });
        }

        // Check if the category already exists in the site's assignedEmployees array
        const existingCategory = site.assignedEmployees.find((entry) => entry.category === category);

        if (existingCategory) {
            // If category exists, append new employees (avoiding duplicates)
            existingCategory.employees = [
                ...new Set([...existingCategory.employees.map(id => id.toString()), ...employeeIds])
            ];
        } else {
            // If category does not exist, add a new category with employees
            site.assignedEmployees.push({ category, employees: employeeIds });
        }

        // Save changes
        await site.save();

        res.status(200).json({ success: true, msg: "Employees assigned successfully", site });
    } catch (error) {
        console.error("Error assigning employees:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};


const getAssignedSites = async (req, res) => {
    try {
        const { employeeId } = req.params;
        console.log("🔍 Fetching assigned sites for Employee ID:", employeeId);

        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: "Invalid Employee ID" });
        }

        const sites = await Site_reg.find({
            "assignedEmployees.employees": employeeId  
        }).populate("assignedEmployees.employees");  // ✅ Populate employees

        if (!sites.length) {
            console.log("No assigned sites found for:", employeeId);
            return res.status(404).json({ message: "No assigned sites found" });
        }

        res.status(200).json({ sites });
    } catch (error) {
        console.error("Error fetching assigned sites:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const removeEmployeeFromSite = async (req, res) => {
    try {
        const { siteId, employeeId } = req.body;

        if (!siteId || !employeeId) {
            return res.status(400).json({ error: "Site ID and Employee ID are required" });
        }

        const site = await Site_reg.findById(siteId);
        if (!site) {
            return res.status(404).json({ error: "Site not found" });
        }
        
        // Remove the employee from assignedEmployees array
        site.assignedEmployees.forEach(category => {
            category.employees = category.employees.filter(emp => emp.toString() !== employeeId);
        });
        
        await site.save();
        
        res.status(200).json({ success: true, message: "Employee removed successfully", site });
        
    } catch (error) {
        console.error("Error removing employee from site:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

const getEmployeesForSite = async (req, res) => {
    try {
        const { siteId } = req.params;
        console.log("Received siteId:", siteId); // Debugging log

        // Fetch site details and populate assigned employees
        const site = await Site_reg.findById(siteId).populate("assignedEmployees.employees");

        if (!site) {
            console.log("Site not found");
            return res.status(404).json({ message: "Site not found" });
        }

        // Log the assigned employees for debugging
        console.log("Fetched Assigned Employees:", JSON.stringify(site.assignedEmployees, null, 2));

        res.json(site.assignedEmployees || []);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getSiteById = async (req, res) => {
    try {
        const siteId = req.params.siteId; // Get the siteId from the request params
        
        // Fetch the site from the database using the siteId
        const site = await Site_reg.findById(siteId);
        
        if (!site) {
            return res.status(404).json({ message: "Site not found" });
        }

        // Respond with the site details
        res.json(site);
    } catch (error) {
        console.error("Error fetching site details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { Createsite, getSites, deleteSite, assignProjectManager, Getmanager, getClientSites, getManagerSites,
     removeManager, assignEmployeeToSite, getAssignedSites, removeEmployeeFromSite, getEmployeesForSite, getSiteById, Getsupervisor, assignSupervisor };
