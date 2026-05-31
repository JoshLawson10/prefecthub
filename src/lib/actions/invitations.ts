"use server";

import { createClient } from "@/lib/supabase/server";

export async function verifyInvitationToken(token: string) {
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*, workspace:workspaces(*)")
    .eq("token", token)
    .single();

  if (error || !invitation) {
    return { valid: false, error: "Invalid invitation token" };
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return { valid: false, error: "Invitation has expired" };
  }

  if (invitation.status === "accepted") {
    return { valid: false, error: "Invitation has already been used" };
  }

  return { valid: true, invitation };
}
