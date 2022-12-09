require('dotenv').config();
const nodemailer = require("nodemailer");
exports.SendEmail = (email,subject, mailotp) => {
  let trasporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'test1001.dds@gmail.com',
      pass: 'mfzf pcwm ebvw svvb',
    },
  });
  let messageOptions = {
    from: 'test1001.dds@gmail.com',                                                       
    to: email,
    subject: subject,
    html: mailotp,
  };
  trasporter.sendMail(messageOptions, (err, res) => {
    if (err) return console.log(err.message,'.....');
    else console.log("Email sent Successfully");
  });
};

