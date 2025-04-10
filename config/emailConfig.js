// emailConfig.js
module.exports = {
  host: "smtp.zoho.com", // Zoho SMTP server
  port: 465, // Use 465 for SSL or 587 for TLS
  secure: true, // true for 465, false for other ports
  auth: {
    user: "noreply@briskmfg.com", // Your Zoho email address
    pass: "1FAed0sa24JE", // Your Zoho email password
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
