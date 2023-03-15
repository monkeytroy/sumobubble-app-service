import nodemailer from 'nodemailer';

export interface Email {
  emailTo: string,
  name: string,
  subject: string,
  body: string
}

export const mailIt = async (email: Email) => {

  let transporter = nodemailer.createTransport({
    host: process.env.BEACON_MAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BEACON_MAIL_FROM,
      pass: process.env.BEACON_MAIL_AUTH,
    }
  });

  let info = await transporter.sendMail({
    from: process.env.BEACON_MAIL_FROM,
    to: email.emailTo,
    subject: email.subject,
    html: email.body,
  });

  console.log("Message sent: %s", info.messageId);

}


