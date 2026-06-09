import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });

    if (!error) {
      let redirectTo: string;
      if (type === "invite") {
        redirectTo = "/onboard";
      } else if (type === "recovery") {
        redirectTo = "/reset-password";
      } else {
        redirectTo = next ?? "/dashboard";
      }
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("Could not complete sign in. Please try again.")}`,
    );
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Invalid or missing token.")}`,
  );
}
