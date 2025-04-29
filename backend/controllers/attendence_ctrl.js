const mongoose = require("mongoose");
const Attendance = require("../models/attendence_model");
const Site_reg = require("../models/site_regmodel");
const Employee_reg = require("../models/emp_regmodel");





const getAssignedSites = async (req, res) => {
    try {
        const { supervisorId } = req.params;
        console.log("Received Supervisor ID:", supervisorId); // ✅ Debugging log

        const sites = await Site_reg.find({ supervisor: supervisorId }) // ✅ Use the correct field name
            .select("site_name site_address status");

        console.log("Fetched Sites:", sites); // ✅ Check what is returned

        if (!sites.length) {
            return res.status(404).json({ error: "No sites assigned to this supervisor" });
        }

        res.status(200).json(sites);
    } catch (error) {
        console.error("❌ Error fetching assigned sites:", error);
        res.status(500).json({ error: "Error fetching assigned sites" });
    }
};


// 2️⃣ Get all employees of a selected site (grouped by category)
const getEmployeesBySite = async (req, res) => {
    try {
        const { siteId } = req.params;
        const site = await Site_reg.findById(siteId).populate("assignedEmployees.employees");

        if (!site) return res.status(404).json({ error: "Site not found" });

        res.status(200).json(site.assignedEmployees);
    } catch (error) {
        console.error("❌ Error fetching employees:", error);
        res.status(500).json({ error: "Error fetching employees" });
    }
};

// 3️⃣ Mark attendance for employees
const getTodayRange = () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of today (00:00:00)
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of today (23:59:59)
    return { todayStart, todayEnd };
};

const markAttendance = async (req, res) => {
    try {
        const { siteId, attendanceRecords } = req.body;

        if (!attendanceRecords || !Array.isArray(attendanceRecords)) {
            return res.status(400).json({ error: "Invalid attendance data format" });
        }

        const { todayStart, todayEnd } = getTodayRange(); // Get today's start and end range
        let alreadyMarkedEmployees = [];
        let newlyInserted = 0;

        for (let record of attendanceRecords) {
            // Check if attendance was marked within the last 24 hours for the same employee
            const existingAttendance = await Attendance.findOne({
                employee: record.employeeId,
                date: { 
                    $gte: todayStart, 
                    $lt: todayEnd // Check within today's date range
                }
            }).populate('employee', 'name');

            // If attendance already marked today, add to alreadyMarkedEmployees
            if (existingAttendance) {
                alreadyMarkedEmployees.push({
                    id: record.employeeId,
                    name: existingAttendance.employee.name
                });
            } else {
                // Otherwise, create new attendance record
                await Attendance.create({
                    employee: record.employeeId,
                    site: siteId,
                    status: record.status,
                    date: new Date() // Record current time
                });
                newlyInserted++;
            }
        }

        // Send response based on marked employees
        if (alreadyMarkedEmployees.length > 0) {
            return res.status(200).json({ 
                message: "Attendance already marked for some employees.", 
                insertedCount: newlyInserted, 
                alreadyMarked: alreadyMarkedEmployees
            });
        }

        res.status(201).json({ 
            message: "Attendance processed successfully!", 
            insertedCount: newlyInserted, 
            alreadyMarked: []
        });

    } catch (error) {
        console.error("❌ Error marking attendance:", error);
        res.status(500).json({ error: "Error marking attendance" });
    }
};



// ✅ Get Today's Attendance for an Employee


const getTodaysAttendance = async (req, res) => {
    try {
        const { employeeId, siteId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of the day
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999); // End of the day

        const attendance = await Attendance.findOne({
            employee: employeeId,
            site: siteId,
            date: { $gte: today, $lt: endOfDay }
        });

        if (!attendance) {
            return res.status(404).json({ message: 'Attendance not found for today' });
        }

        // Get employee details
        const employee = await Employee_reg.findById(employeeId).select('name');
        
        // Get site details (address)
        const site = await Site_reg.findById(siteId).select('address');

        res.status(200).json({
            attendance,
            employee,  // Returning employee details
            site  // Returning site address
        });
    } catch (error) {
        console.error("❌ Error fetching today's attendance:", error);
        res.status(500).json({ error: "Error fetching today's attendance" });
    }
};
const getMonthlyAttendance = async (req, res) => {
    try {
        const { employeeId, siteId } = req.params;
        const { year, month } = req.query; // Expecting year and month in query params

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0); // Last day of the month

        const attendances = await Attendance.find({
            employee: employeeId,
            site: siteId,
            date: { $gte: startOfMonth, $lt: endOfMonth }
        });

        if (!attendances || attendances.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this month' });
        }

        // Get employee details
        const employee = await Employee_reg.findById(employeeId).select('name');
        
        // Get site details (address)
        const site = await Site_reg.findById(siteId).select('address');

        res.status(200).json({
            attendances,
            employee,  // Returning employee details
            site  // Returning site address
        });
    } catch (error) {
        console.error("❌ Error fetching monthly attendance:", error);
        res.status(500).json({ error: "Error fetching monthly attendance" });
    }
};

const getAttendanceSummary = async (req, res) => {
    try {
        const { employeeId, siteId } = req.params;

        const attendanceSummary = await Attendance.aggregate([
            { $match: { employee: mongoose.Types.ObjectId(employeeId), site: mongoose.Types.ObjectId(siteId) } },
            {
                $group: {
                    _id: null,
                    presentCount: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
                    absentCount: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
                    leaveCount: { $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] } },
                }
            }
        ]);

        if (!attendanceSummary || attendanceSummary.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this employee' });
        }

        // Get employee details
        const employee = await Employee_reg.findById(employeeId).select('name');
        
        // Get site details (address)
        const site = await Site_reg.findById(siteId).select('address');

        res.status(200).json({
            summary: attendanceSummary[0],
            employee,  // Returning employee details
            site  // Returning site address
        });
    } catch (error) {
        console.error("❌ Error fetching attendance summary:", error);
        res.status(500).json({ error: "Error fetching attendance summary" });
    }
};


module.exports = {
    getAssignedSites,
    getEmployeesBySite,
    markAttendance,
    getTodaysAttendance,
    getMonthlyAttendance,
    getAttendanceSummary
};
