import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

export function initializeEmailService(): void {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
    console.log("Email service initialized");
  } else {
    console.warn("SMTP not configured — emails will be logged to console");
  }
}

export async function sendSheetAccessEmail(
  to: string,
  userName: string,
  sheetUrl: string,
  planName: string
): Promise<void> {
  const subject = `Your Lead Generator ${planName} Plan — Google Sheet is Ready`;
  const text =
    `Hi ${userName},\n\n` +
    `Thank you for subscribing to the ${planName} plan!\n\n` +
    `Your personalised lead sheet is ready. You can view it here:\n${sheetUrl}\n\n` +
    `This sheet is shared with read-only access to your email (${to}).\n` +
    `New leads will be automatically added as they become available.\n\n` +
    `Best,\nThe Lead Generator Team`;

  if (transporter) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@leadgenerator.app",
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to} — subject: "${subject}"`);
  } else {
    console.log(`[EMAIL LOG] To: ${to} | Subject: ${subject}\n${text}`);
  }
}
