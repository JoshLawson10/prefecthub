"use server";

import { createQueryClient } from "@/lib/supabase/query";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/data/users";
import { getWorkspace } from "@/lib/data/workspaces";
import { getInvitationEmailTemplate } from "@/lib/emails/invitation";
import { getMailTransport } from "@/lib/emails/mailer";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

export async function updateMemberRole(input: {
  memberId: string;
  newRole: string;
}): Promise<void> {
  const supabase = createQueryClient();
  const { error } = await supabase
    .from("users")
    .update({ role: input.newRole, updated_at: new Date().toISOString() })
    .eq("id", input.memberId);
  if (error) throw new Error(error.message);
}

export async function removeMember(memberId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(memberId);
  if (error) throw new Error(error.message);
}

export async function inviteMember(email: string) {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.workspace_id) {
    throw new Error("You must be in a workspace to invite members");
  }

  if (!["admin", "captain"].includes(currentUser.role)) {
    throw new Error("Only admins and captains can invite members");
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error("Invalid email address");
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existingUser) {
    const { data: userWorkspace } = await supabase
      .from("users")
      .select("workspace_id")
      .eq("id", existingUser.id)
      .single();

    if (userWorkspace?.workspace_id === currentUser.workspace_id) {
      throw new Error("User is already a member of this workspace");
    }

    // TODO: Handle user exists but in different workspace
    throw new Error("User already exists in a different workspace");
  }

  const { data: existingInvitation } = await supabase
    .from("invitations")
    .select("id, expires_at, status")
    .eq("email", email)
    .eq("workspace_id", currentUser.workspace_id)
    .eq("status", "pending")
    .single();

  if (existingInvitation) {
    if (new Date(existingInvitation.expires_at) > new Date()) {
      throw new Error("An invitation has already been sent to this email");
    }

    await supabase.from("invitations").delete().eq("id", existingInvitation.id);
  }

  const workspace = await getWorkspace(currentUser.workspace_id);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      email,
      workspace_id: currentUser.workspace_id,
      role: "prefect",
      invited_by: currentUser.id,
      token,
      expires_at: expiresAt.toISOString(),
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invitation: ${error.message}`);
  }

  await sendInvitationEmail(
    email,
    token,
    currentUser.full_name,
    workspace.name,
    "Prefect",
  );

  revalidatePath("/members");

  return invitation;
}

async function sendInvitationEmail(
  email: string,
  token: string,
  inviterName: string,
  workspaceName: string,
  role: string,
) {
  const inviteUrl = `${process.env.SITE_URL}/onboard?token=${token}`;
  const expiresIn = 7;

  const html = getInvitationEmailTemplate({
    inviterName,
    workspaceName,
    role,
    inviteUrl,
    expiresIn,
  });

  if (
    process.env.NODE_ENV === "development" &&
    process.env.SEND_EMAILS !== "true"
  ) {
    console.log(`\n[DEV] Invitation email → ${email}`);
    console.log(`[DEV] Invite link: ${inviteUrl}`);
    console.log(
      `[DEV] Set SEND_EMAILS=true in .env to send real emails in dev\n`,
    );
    return;
  }

  const transport = getMailTransport();
  await transport.sendMail({
    from: `"PrefectHub" <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: `You've been invited to join ${workspaceName} on PrefectHub`,
    html,
  });
}
