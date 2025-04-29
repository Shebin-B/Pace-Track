const express = require("express");
const AttendanceReport  = require("../controllers/empreport_ctrl");
const router = express.Router();

// Route for fetching attendance report by employeeId
router.get("/report/:employeeId", AttendanceReport.getAttendanceReport);

module.exports = router;
