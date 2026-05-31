"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "../data/users";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

export async function updateMemberRole(input: {
  memberId: string;
  newRole: string;
}): Promise<void> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
    currentUser.workspace_id,
  );

  revalidatePath("/members");

  return invitation;
}

async function sendInvitationEmail(
  email: string,
  token: string,
  inviterName: string,
  workspaceId: string,
) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/onboard?token=${token}`;

  // Use Resend or your email provider
  // For now, just log it
  console.log(`Invitation email to ${email}: ${inviteUrl}`);

  // Example with Resend (uncomment when you have API key):
  /*
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Prefect Hub <noreply@prefecthub.com>',
      to: email,
      subject: `You've been invited to join Prefect Hub`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Invitation to Prefect Hub</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Prefect Hub</h1>
            </div>
            
            <h2>You've been invited!</h2>
            
            <p><strong>${inviterName}</strong> has invited you to join their prefect team on Prefect Hub.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Accept Invitation
              </a>
            </div>
            
            <p>Or copy and paste this link into your browser:</p>
            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; word-break: break-all;">${inviteUrl}</p>
            
            <p>This invitation will expire in 7 days.</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 12px;">
              If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </body>
        </html>
      `,
    }),
  });
  */
}
