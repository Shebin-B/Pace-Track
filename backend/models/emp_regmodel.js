const mongoose = require("mongoose");

const empregschema = new mongoose.Schema({
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
        required: true
    },
    work_category: {
        type: String,
        required: true
    },
    salary: {
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
    }
});

const Employee_reg = mongoose.model("employee", empregschema);

module.exports = Employee_reg;
