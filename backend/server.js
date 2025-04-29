const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const nodemailer = require("nodemailer");

require("dotenv").config({ path: "./email.env" });


const emp_regroute = require("./routes/emp_regroute");
const client_regroute = require("./routes/client_regroute");
const pm_regroute = require("./routes/pm_regroutes");
const ss_regroute = require("./routes/ss_regroutes");

const site_regroute = require("./routes/site_regroute");
const imageRoutes = require("./routes/imageRoutes"); 
const attendence_route = require("./routes/attendence_route");

const loginroutes = require('./routes/login_route');

const clientdetails=require("./routes/clientpage_route")

const pmRoutes = require("./routes/pmpage_route"); // ✅ Rename to avoid conflicts

const supervisordetails=require("./routes/sspage_route")


const reportRoutes = require("./routes/report_route");

const employeeReportRoutes = require("./routes/empreport_route"); // adjust path



const app = express();
const PORT = 5004;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/empregister", emp_regroute);
app.use("/api/clientregister", client_regroute);

app.use("/api/supervisorregister", ss_regroute);

app.use("/api/managerregister", pm_regroute);
app.use("/api/siteregister", site_regroute);
app.use("/api/images", imageRoutes);
app.use("/api/attendence", attendence_route)

app.use('/api/loginuser', loginroutes);


app.use('/api/clients', clientdetails);

app.use('/api/managers', pmRoutes); // ✅ Use new variable

app.use('/api/supervisors', supervisordetails);

app.use("/reports", reportRoutes);


app.use("/uploads", express.static("uploads"));

app.use("/api/attendance", employeeReportRoutes);










app.post("/api/send-email", async (req, res) => {
    const { name, email, message } = req.body;
  
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    let mailOptions = {
      from: `"${name}" <${email}>`, // Properly format sender info
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.json({ success: false, message: "Error sending email." });
    }
  });





  


  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
