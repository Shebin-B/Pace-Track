const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    category: { type: String, required: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Image", ImageSchema);
