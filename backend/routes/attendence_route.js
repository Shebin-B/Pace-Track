const express = require('express');
const router = express.Router();
const attendancecontroller = require("../controllers/attendence_ctrl");




router.get("/sites/:supervisorId", attendancecontroller.getAssignedSites);
router.get("/employees/:siteId", attendancecontroller.getEmployeesBySite);
router.post("/mark", attendancecontroller.markAttendance);


router.get('/today/:employeeId/:siteId', attendancecontroller.getTodaysAttendance);

// Route to fetch monthly attendance for a specific employee and site
// It expects 'year' and 'month' as query parameters
router.get('/monthly/:employeeId/:siteId', attendancecontroller.getMonthlyAttendance);

// Route to fetch attendance summary (presents, absents, leaves) for a specific employee and site
router.get('/summary/:employeeId/:siteId', attendancecontroller.getAttendanceSummary);


module.exports = router;
