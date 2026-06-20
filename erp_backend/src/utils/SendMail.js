//import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// VERIFY CONNECTION ON SERVER START
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mail server connection failed:", error);
  } else {
    console.log("✅ Mail server is ready to send emails");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"MyStore" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email Error:", error);
    return false;
  }
};
module.exports = sendEmail;

//export default sendEmail;

// const nodemailer = require("nodemailer");
// // const sgMail = require('@sendgrid/mail')

// const sendMail = async (from, to, subject, content, attachment = []) => {

//     const transporter = nodemailer.createTransport({
//         host: "mail.infomaniak.com",
//         port: 587,
//         secure: false,
//         auth: {
//             user: 'support@cph4.ch',
//             pass: '7BE#Zas$1#4b9',
//         },
//     });

//     const mailOptions = {
//         from: 'support@cph4.ch',
//         to: to,
//         subject: subject,
//         html: content
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//             return false;
//         } else {
//             console.log('Email sent: ' + info.response);
//             return true
//         }
//     });
// }

// module.exports = {
//     sendMail
// }
