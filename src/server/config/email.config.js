const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "leandraw005@gmail.com",
    pass: "tjhe eyue ypyy uivg",
  },
});

module.exports = transporter;