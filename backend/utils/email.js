const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Send email
const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
