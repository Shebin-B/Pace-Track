const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Leave"], required: true }
  },
 
);

// Ensure unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });




const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;