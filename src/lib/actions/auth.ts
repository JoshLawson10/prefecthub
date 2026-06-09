"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawRedirect = (formData.get("redirectTo") as string) || "/dashboard";
  // Guard against open-redirect: only allow relative paths starting with /
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/dashboard";

  if (!email || !password) {
    const errorMessage = encodeURIComponent("Email and password are required");
    redirect(`/login?error=${errorMessage}`);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let errorMessage = error.message;

    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please confirm your email address before signing in.";
    }

    const encodedError = encodeURIComponent(errorMessage);
    redirect(`/login?error=${encodedError}`);
  }

  redirect(redirectTo);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    redirect(`/forgot-password?error=${encodeURIComponent("Email is required")}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // Supabase appends token_hash + type=recovery to this URL
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  // Always show success — never confirm whether an email exists
  redirect(`/forgot-password?success=true`);
}

export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!password || password.length < 8) {
    redirect(`/reset-password?error=${encodeURIComponent("Password must be at least 8 characters")}`);
  }

  if (password !== confirm) {
    redirect(`/reset-password?error=${encodeURIComponent("Passwords don't match")}`);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?success=" + encodeURIComponent("Password updated. Please sign in."));
}
