import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

/**
 * Best-effort email send — logs and returns false on any failure rather
 * than throwing, so a broken mail config never blocks a donation from
 * being recorded as paid.
 */
export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    console.warn("[mailer] SMTP not configured — skipping email to", to);
    return false;
  }

  try {
    await t.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send email:", err.message);
    return false;
  }
}
