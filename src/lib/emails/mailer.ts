import nodemailer from "nodemailer";

/**
 * SMTP transporter using Gmail.
 * Requires MAIL_SERVER, MAIL_USERNAME, and MAIL_PASSWORD in .env.local.
 * Uses port 465 with SSL — the most reliable option for Gmail app passwords.
 */
function createTransport() {
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;
  const host = process.env.MAIL_SERVER ?? "smtp.gmail.com";

  if (!user || !pass) {
    throw new Error(
      "MAIL_USERNAME and MAIL_PASSWORD must be set in environment variables.",
    );
  }

  return nodemailer.createTransport({
    host,
    port: 465,
    secure: true, // SSL on 465 — required for Gmail app passwords
    auth: { user, pass },
  });
}

// Cache the transport instance to avoid recreating on every call
let _transport: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getMailTransport() {
  if (!_transport) _transport = createTransport();
  return _transport;
}

/**
 * Verifies the SMTP connection and credentials.
 * Call this from an API route during setup to confirm Gmail auth is working.
 * Returns true on success, throws a descriptive error on failure.
 */
export async function verifyMailTransport(): Promise<true> {
  const transport = getMailTransport();
  await transport.verify();
  return true;
}
