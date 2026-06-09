import { NextResponse } from "next/server";
import { verifyMailTransport } from "@/lib/emails/mailer";

/**
 * GET /api/mail/verify
 * Verifies the SMTP connection and credentials without sending an email.
 * Remove or protect this route before going to production.
 */
export async function GET() {
  try {
    await verifyMailTransport();
    return NextResponse.json({
      ok: true,
      message: "SMTP connection verified — Gmail auth is working.",
      from: process.env.MAIL_USERNAME,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
