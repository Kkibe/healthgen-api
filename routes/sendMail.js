const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendMail = ({email, name}) => {

// Render the HTML template with EJS
const emailTemplatePath = path.join(__dirname, 'emailTemplate.html');
ejs.renderFile(emailTemplatePath, {email, name, sender: process.env.EMAIL}, (err, html) => {
  if (err) {
    console.log(`Error: ${err}`);
    //return;
  }

  // Set up email data
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to Our Service',
    html: html
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error: ${error}`);
    }
      console.log(`Email sent:`);
  });
});
}

module.exports = {sendMail};