import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    console.log("EMAIL: Creating transporter...");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log("EMAIL: Sending mail...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    console.log("EMAIL SENT:", info.response);

    return info;

  } catch (error) {
    console.log("EMAIL ERROR:", error);
    throw error;
  }
};

export default sendEmail;