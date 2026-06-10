"use server";

import { createQueryClient } from "@/lib/supabase/query";

export async function verifyInvitationToken(token: string) {
  const supabase = createQueryClient();

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
