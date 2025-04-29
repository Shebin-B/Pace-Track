const mongoose = require("mongoose");

const ss_regschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Just like in Client schema
    },
    password: {
        type: String,
        required: true // Should be required for registration
    },
    image: {  // Profile Picture
        data: Buffer,
        contentType: String
    },
    idProof: { // ID Proof (Aadhar, Passport, etc.)
        data: Buffer,
        contentType: String
    },
    status: {
        type: String,
        default: "pending"
    }
});

const ss_register = mongoose.model("sitesupervisors", ss_regschema);

module.exports = ss_register;
