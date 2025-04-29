const multer = require("multer");
const path = require("path");

// Configure storage to save files in "uploads" directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
    }
});

const upload = multer({ storage });

module.exports = upload;
