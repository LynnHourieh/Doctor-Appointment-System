import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async (to: string, subject: string, html: string) => {
  const { NODE_ENV, MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

  if (NODE_ENV === "development") {
    // ✅ Real SMTP in development
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      secure: false, // true for 465, false for 587
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CarePortal Admin" <${MAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to} (dev mode via SMTP)`);
  } else {
    // ✅ SendGrid for production
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_SENDER) {
      throw new Error("Missing SendGrid config");
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to,
      from: process.env.SENDGRID_SENDER,
      subject,
      html,
    });

    console.log(`📧 Email sent to ${to} (prod via SendGrid)`);
  }
};
