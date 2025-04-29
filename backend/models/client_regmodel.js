const mongoose = require("mongoose");

const clientregschema = new mongoose.Schema({
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
        unique: true  
    },
    password: {
        type: String,
        required: true
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

const Client_register = mongoose.model("clients", clientregschema);

module.exports = Client_register;
