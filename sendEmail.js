// sendEmail.js
const nodemailer = require("nodemailer");
const emailConfig = require("./config/emailConfig");
require('dotenv').config();

async function sendEmail(filePath, filename) {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: emailConfig.from,
    to: Array.isArray(emailConfig.to)
      ? emailConfig.to.join(", ")
      : emailConfig.to,
    subject: "Sales Order Report", // Email subject
    text: "Please find the sales order report attached for today.", // Email body
    attachments: [
      {
        filename: filename, // Name of the attachment
        path: filePath, // Path to the file
      },
    ],
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
