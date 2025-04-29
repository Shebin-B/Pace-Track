const express = require("express");
const attendanceController = require('../controllers/reports_controllers');

const router = express.Router();

router.get("/reports/employee/:employeeId/range", (req, res) => {
  const { employeeId } = req.params; // Employee ID from URL
  const { startDate, endDate, type } = req.query; // Start and End Dates, Report Type

  // Validate report type
  if (type !== 'pdf' && type !== 'excel') {
    return res.status(400).json({ error: 'Invalid report type' });
  }

  // Validate required parameters
  if (!startDate || !endDate || !employeeId) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Call appropriate function based on report type
  if (type === 'pdf') {
    return attendanceController.generateEmployeePdfReport(req, res);
  } else if (type === 'excel') {
    return attendanceController.generateEmployeeExcelReport(req, res);
  }

  // If no valid type, send a 400 response
  return res.status(400).json({ error: 'Invalid report type' });
});


// New route for employee-site-range report generation (PDF or Excel)
router.get("/report/employee/:employeeId/site/:siteId/range", (req, res) => {
    const { type } = req.query;
    if (type === "pdf") {
        attendanceController.generateEmployeeSitePDFReportRange(req, res);
    } else if (type === "excel") {
        attendanceController.generateEmployeeSiteExcelReportRange(req, res);
    } else {
        res.status(400).json({ error: "Invalid report type" });
    }
});

module.exports = router;
