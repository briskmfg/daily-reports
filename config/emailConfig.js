// emailConfig.js
require('dotenv').config();

module.exports = {
  host: "smtp.zoho.com", // Zoho SMTP server
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Zoho email address
    pass: process.env.EMAIL_PASS, // Your Zoho email password
  },
  from: "noreply@briskmfg.com", // Sender email address
  to: [
    "tamsilk.khan@gmail.com",
    "info@briskmfg.com",
    "sathya@briskmfg.com",
    "accounts@briskmfg.com",
    "customerservice@briskmfg.com",
    "santosh@briskmfg.com",
  ],
  //   to: ["tamsilk.khan@gmail.com"],
};
