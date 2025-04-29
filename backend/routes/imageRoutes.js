const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Image = require("../models/imageModel"); // Import Image model

// 🟢 Ensure Uploads Directory Exists
const ensureUploadsDir = (category) => {
    const uploadPath = path.join(__dirname, "..", "uploads", category);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
    }
};

// 🟢 Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const category = req.params.category || "others";
        ensureUploadsDir(category);
        cb(null, path.join(__dirname, "..", "uploads", category));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// 🟢 Initialize Multer
const upload = multer({ storage: storage });

// 🔹 Upload Image API
router.post("/upload/:category", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "No file uploaded" });
        }

        const category = req.params.category;

        // Save image details in MongoDB
        const newImage = new Image({
            category: category,
            filename: req.file.filename,
            filepath: `/uploads/${category}/${req.file.filename}`,
        });

        await newImage.save();

        res.json({
            success: true,
            message: "File uploaded and stored in database",
            filename: req.file.filename,
            filepath: newImage.filepath,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

// 🔹 Fetch Images by Category API
router.get("/category/:category", async (req, res) => {
    try {
        const images = await Image.find({ category: req.params.category });
        res.json({ images });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ success: false, error: "Database error" });
    }
});

module.exports = router;
