const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const moment = require("moment");
const Employee = require("../models/emp_regmodel");
const Attendance = require("../models/attendence_model");

const calculateSalary = (attendanceRecords, dailyWage) => {
  const presentDays = attendanceRecords.filter(a => a.status === "Present").length;
  return presentDays * dailyWage;
};

exports.generateEmployeePdfReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Validate startDate and endDate format
    if (startDate && !moment(startDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid startDate format. Use YYYY-MM-DD." });
    }
    if (endDate && !moment(endDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid endDate format. Use YYYY-MM-DD." });
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const filter = {
      employee: id,
      ...(startDate && endDate && {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
    };

    const records = await Attendance.find(filter).sort({ date: 1 });
    if (records.length === 0) return res.status(404).json({ message: "No attendance records found" });

    const totalSalary = calculateSalary(records, employee.salary);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${employee.name}_Attendance_Report.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`Attendance Report - ${employee.name}`, { align: "center" });
    doc.fontSize(12).text(`Phone: ${employee.phone}`);
    doc.text(`Work Category: ${employee.work_category}`);
    doc.text(`Daily Wage: ₹${employee.salary}`);
    doc.text(`Total Salary (Present Days): ₹${totalSalary}`);
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"}`);
    doc.moveDown();

    records.forEach((r, i) => {
      doc.text(`${i + 1}. ${new Date(r.date).toDateString()} - ${r.status}`);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating PDF", error: error.message });
  }
};

exports.generateEmployeeExcelReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Validate startDate and endDate format
    if (startDate && !moment(startDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid startDate format. Use YYYY-MM-DD." });
    }
    if (endDate && !moment(endDate, "YYYY-MM-DD", true).isValid()) {
      return res.status(400).json({ message: "Invalid endDate format. Use YYYY-MM-DD." });
    }

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const filter = {
      employee: id,
      ...(startDate && endDate && {
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
    };

    const records = await Attendance.find(filter).sort({ date: 1 });
    if (records.length === 0) return res.status(404).json({ message: "No attendance records found" });

    const totalSalary = calculateSalary(records, employee.salary);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance");

    worksheet.addRow([`Employee:`, employee.name]);
    worksheet.addRow([`Phone:`, employee.phone]);
    worksheet.addRow([`Work Category:`, employee.work_category]);
    worksheet.addRow([`Daily Wage: ₹`, employee.salary]);
    worksheet.addRow([`Total Salary (Present): ₹`, totalSalary]);
    worksheet.addRow([`Date Range:`, `${startDate || "All"} - ${endDate || "All"}`]);
    worksheet.addRow([]); // empty row

    worksheet.columns = [
      { header: "S.No", key: "sno", width: 10 },
      { header: "Date", key: "date", width: 20 },
      { header: "Status", key: "status", width: 15 },
    ];

    records.forEach((r, i) => {
      worksheet.addRow({
        sno: i + 1,
        date: new Date(r.date).toDateString(),
        status: r.status
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${employee.name}_Attendance_Report.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating Excel report", error: error.message });
  }
};

exports.generateEmployeeSitePDFReportRange = async (req, res) => {
  try {
    const { employeeId, siteId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required" });
    }

    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      site: siteId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found in the selected date range." });
    }

    const employee = await Employee.findById(employeeId);
    const site = await Site.findById(siteId);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${employee.name}_Attendance_${site.site_address}.pdf"`);

    doc.pipe(res);

    // -- Header --
    doc.font("Helvetica-Bold").fontSize(22).fillColor("#0066cc").text("PaceTrack", { align: "center" });
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#333333").text("Employee Attendance Report", { align: "center" });
    doc.moveDown();

    // -- Info Box --
    const boxY = doc.y;
    doc.lineWidth(1).strokeColor("#000").rect(50, boxY, 500, 70).stroke();
    doc.font("Helvetica").fontSize(12).fillColor("#000");
    doc.text(`Employee: ${employee.name}`, 60, boxY + 10);
    doc.text(`Site: ${site.site_address}`, 60, boxY + 30);
    doc.text(`Date Range: ${moment(start).format("YYYY-MM-DD")} to ${moment(end).format("YYYY-MM-DD")}`, 60, boxY + 50);
    doc.moveDown(3);

    // -- Table Headers --
    const tableX = 50;
    let tableY = doc.y;
    const col1Width = 200;
    const col2Width = 300;

    // Draw header background
    doc.rect(tableX, tableY, col1Width + col2Width, 25).fillAndStroke("#dddddd", "#000000");
    doc.fillColor("#000000").font("Helvetica-Bold").fontSize(12);
    doc.text("Date", tableX + 10, tableY + 7);
    doc.text("Status", tableX + col1Width + 10, tableY + 7);

    // -- Table Rows --
    tableY += 25;
    doc.font("Helvetica").fontSize(12).fillColor("#000000");

    attendanceRecords.forEach((record) => {
      // Row box
      doc.rect(tableX, tableY, col1Width + col2Width, 25).stroke();
    
      // Format and write date and status
      const formattedDate = moment(new Date(record.date)).format("YYYY-MM-DD");
      doc.text(formattedDate, tableX + 10, tableY + 7);
      doc.text(record.status, tableX + col1Width + 10, tableY + 7);
    
      // Move to next row
      tableY += 25;
    
      // Handle page break
      if (tableY + 30 > doc.page.height - 50) {
        doc.addPage();
        tableY = 50;
      }
    });
    
    doc.end();
  } catch (error) {
    console.error("PDF Report Error:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
};
exports.generateEmployeeSiteExcelReportRange = async (req, res) => {
  try {
    const { employeeId, siteId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Start and end dates are required" });
    }
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    
    const attendanceRecords = await Attendance.find({
      employee: employeeId,
      site: siteId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found in the selected date range." });
    }

    const employee = await Employee.findById(employeeId);
    const site = await Site.findById(siteId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Report");

    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 15 },
    ];

    worksheet.addRow(["Employee", employee.name]);
    worksheet.addRow(["Site", site.site_address]);
    worksheet.addRow(["Date Range", `${startDate} to ${endDate}`]);
    worksheet.addRow([]); // empty row

    attendanceRecords.forEach((record) => {
      worksheet.addRow({
        date: moment(record.date).format("YYYY-MM-DD"),
        status: record.status,
      });
    });
    

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${employee.name}_Attendance_${site.site_address}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel Report Error:", error);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};