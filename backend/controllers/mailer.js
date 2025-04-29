const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./email.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 👉 Function to send approval email (with HTML)
const sendApprovalEmail = async (toEmail, clientName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Account Approved - Welcome to PaceTrack!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1976d2;">Congratulations, ${clientName}!</h2>
        <p>Your registration has been <strong>approved</strong>. You can now log in and start managing your projects with PaceTrack.</p>
        <p style="margin-top: 20px;">If you have any questions, feel free to reach out to our support team.</p>
        <p>Thank you!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Approval email sent successfully to:", toEmail);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

// 👉 Function to send rejection email (still plain text)
const sendRejectionEmail = async (toEmail, clientName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Registration Status",
    text: `Dear ${clientName},\n\nWe regret to inform you that your registration was not approved.\n\nThank you for your interest.\n\n- Pace Track Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Rejection email sent successfully to:", toEmail);
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};



// 👉 Function to send approval email for Project Manager
const sendManagerApprovalEmail = async (toEmail, managerName) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Account Approved - Welcome to PaceTrack!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1976d2;">Congratulations, ${managerName}!</h2>
          <p>Your registration as a Project Manager has been <strong>approved</strong>. You can now log in and start managing your projects with PaceTrack.</p>
          <p style="margin-top: 20px;">If you have any questions, feel free to reach out to our support team.</p>
          <p>Thank you!</p>
        </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Project Manager approval email sent successfully to:", toEmail);
    } catch (error) {
      console.error("Error sending Project Manager approval email:", error);
    }
  };
  
  // 👉 Function to send rejection email for Project Manager (plain text)
  const sendManagerRejectionEmail = async (toEmail, managerName) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Registration Status",
      text: `Dear ${managerName},\n\nWe regret to inform you that your registration as a Project Manager was not approved.\n\nThank you for your interest.\n\n- Pace Track Team`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Project Manager rejection email sent successfully to:", toEmail);
    } catch (error) {
      console.error("Error sending Project Manager rejection email:", error);
    }
  };
  

  // 👉 Function to send approval email for Site Supervisors
const sendSupervisorApprovalEmail = async (toEmail, supervisorName) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Account Approved - Welcome to PaceTrack!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1976d2;">Congratulations, ${supervisorName}!</h2>
          <p>Your registration as a Site Supervisor has been <strong>approved</strong>. You can now log in and start managing your sites with PaceTrack.</p>
          <p style="margin-top: 20px;">If you have any questions, feel free to reach out to our support team.</p>
          <p>Thank you!</p>
        </div>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Site Supervisor approval email sent successfully to:", toEmail);
    } catch (error) {
      console.error("Error sending Site Supervisor approval email:", error);
    }
  };
  
  // 👉 Function to send rejection email for Site Supervisors (plain text)
  const sendSupervisorRejectionEmail = async (toEmail, supervisorName) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Registration Status",
      text: `Dear ${supervisorName},\n\nWe regret to inform you that your registration as a Site Supervisor was not approved.\n\nThank you for your interest.\n\n- Pace Track Team`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Site Supervisor rejection email sent successfully to:", toEmail);
    } catch (error) {
      console.error("Error sending Site Supervisor rejection email:", error);
    }
  };
  module.exports = {
    sendApprovalEmail,
    sendRejectionEmail,
    sendManagerApprovalEmail,
    sendManagerRejectionEmail,
    sendSupervisorApprovalEmail,
    sendSupervisorRejectionEmail,
  };