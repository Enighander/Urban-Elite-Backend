const nodemailer = require("nodemailer");

const sendPasswordResetEmail = async (email, newPassword) => {
  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    // Specify your email service provider and credentials
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: "christian.feeney@ethereal.email",
      pass: "8AtnzVtxdAsSD6jJQN",
    },
  });

  // Compose the email message
  let mailOptions = {
    from: "christian.feeney@ethereal.email",
    to: email,
    subject: "Password Reset",
    text: `Your new password is: ${newPassword}. Please change it after logging in.`,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  sendPasswordResetEmail,
};
