const nodemailer = require('nodemailer');
const dotenv=require('dotenv');

let temp = dotenv.config({ path: "../../config/config.env" })

// Create a transporter using SMTP
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 2525    ,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  
    const info = await transporter.sendMail(message);
  
    console.log('Message sent: %s', info.messageId);
  };
  
  module.exports = sendEmail;