const mongoose = require("mongoose");
const Attendance = require("../models/attendence_model");

exports.getAttendanceReport = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { from, to } = req.query;

    /* early validation */
    if (!mongoose.isValidObjectId(employeeId))
      return res.status(400).json({ message: "Invalid employeeId" });
    if (!from || !to)
      return res.status(400).json({ message: "'from' and 'to' are required (YYYY-MM-DD)" });

    /* inclusive whole-day range */
    const start = new Date(from); start.setUTCHours(0, 0, 0, 0);
    const end = new Date(to); end.setUTCHours(23, 59, 59, 999);

    const rows = await Attendance.find({
      employee: employeeId,
      date: { $gte: start, $lte: end }
    })
      .populate("employee", "name")  // Populate employee field with name
      .populate("site", "site_address")  // Populate site field with site address
      .lean();

    return res.json({ count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
