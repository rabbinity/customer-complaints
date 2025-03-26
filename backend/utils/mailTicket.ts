import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendTicket = async (
  emailOptions: EmailOptions,
  pdfBuffer: Uint8Array
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailOptions.to,
      subject: emailOptions.subject,
      html: emailOptions.html,
      attachments: [
        {
          filename: "Tickets.pdf",
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    console.log(`Email sent to ${emailOptions.to}`);
  } catch (error) {
    console.error(`Error sending email to ${emailOptions.to}:`, error);
    throw error;
  }
};
