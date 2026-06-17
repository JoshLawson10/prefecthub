import nodemailer from "nodemailer";

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
    secure: true,
    auth: { user, pass },
  });
}

let _transport: ReturnType<typeof nodemailer.createTransport> | null = null;

export function getMailTransport() {
  if (!_transport) _transport = createTransport();
  return _transport;
}

export async function verifyMailTransport(): Promise<true> {
  const transport = getMailTransport();
  await transport.verify();
  return true;
}
