const mongoose = require("mongoose");

const pmregschema = new mongoose.Schema({
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
        unique: true  // Optional but recommended
    },

    password: {
        type: String,
        required: false
    },

    image: {  // Profile Picture
        data: Buffer,
        contentType: String
    },

    idProof: {  // ID Proof (Aadhar, Passport, etc.)
        data: Buffer,
        contentType: String
    },

    status: {
        type: String,
        default: "pending"
    }
});

const Pm_register = mongoose.model("managers", pmregschema);

module.exports = Pm_register;
