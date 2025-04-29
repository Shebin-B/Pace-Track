const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
    client_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clients",
        required: true
    },
    site_address: {
        type: String,
        required: true,
        trim: true
    },
    total_cost: {
        type: Number,
        required: true,
        min: [0, "Total cost cannot be negative"]
    },
    end_date: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: "End date must be in the future."
        }
    },
    status: {
        type: String,
        enum: ["Pending", "Ongoing", "Completed"],
        default: "Pending"
    },
    project_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "managers",
        default: null
    },

    supervisor: { // New supervisor reference added
        type: mongoose.Schema.Types.ObjectId,
        ref: "sitesupervisors", 
        default: null
    },
    assignedEmployees: [
        {
            category: String, // Work category (e.g., 'Masonry', 'Plumbing')
            employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "employee" }] // List of employees
        }
    ]
});

const Site_reg = mongoose.models.Site || mongoose.model("Site", siteSchema);

module.exports = Site_reg;
