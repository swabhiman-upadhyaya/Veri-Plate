const nodemailer = require('nodemailer');
const { env } = require('../config');

// Keep a cached test account to reuse it
let testAccount = null;

const sendEmail = async (options) => {
  let transporter;

  // If using the default fake ethereal credentials, generate real ones on the fly
  if (env.EMAIL_USER === 'ethereal.user@ethereal.email') {
    if (!testAccount) {
      testAccount = await nodemailer.createTestAccount();
    }
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  } else {
    // Make sure we have the correct service context for Gmail if using gmail
    const isGmail = env.EMAIL_HOST.includes('gmail');
    const transportConfig = {
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
      }
    };
    if (isGmail) {
        transportConfig.service = 'gmail';
    }
    transporter = nodemailer.createTransport(transportConfig);
  }

  const message = {
    from: `${env.FROM_NAME} <${env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div><p>${options.message}</p></div>`
  };

  const info = await transporter.sendMail(message);
  
  if (env.EMAIL_USER === 'ethereal.user@ethereal.email') {
      console.log('✉️  OTP Email simulated successfully!');
      console.log('🔗 Ethereal Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log(`➡️ The OTP is in the preview URL above.`);
  } else {
      console.log('✉️  Email sent securely to %s', options.email);
  }
};

module.exports = sendEmail;
