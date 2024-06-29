const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ac.bensalem@gmail.com',
    pass: 'fngy cbnh zfyc rpoc',
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'ac.bensalem@gmail.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;
