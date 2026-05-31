"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface UpdateProfileInput {
  memberId: string;
  fullName: string;
  email: string;
}

export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({
      full_name: input.fullName,
      email: input.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.memberId);
  if (error) throw new Error(error.message);
}

export interface UploadAvatarInput {
  memberId: string;
  file: File;
}

export async function uploadAvatar(input: UploadAvatarInput): Promise<void> {
  const supabase = await createClient();
  const buffer = await input.file.arrayBuffer();
  const fileName = `${input.memberId}-${Date.now()}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, buffer, { contentType: input.file.type, upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from("users")
    .update({
      avatar_url: data.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.memberId);
  if (updateError) throw new Error(updateError.message);
}

export async function deleteAccount(memberId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(memberId);
  if (error) throw new Error(error.message);
}

interface OnboardingData {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: invitation, error: inviteError } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", data.token)
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invalid or expired invitation");
  }

  if (new Date(invitation.expires_at) < new Date()) {
    throw new Error("Invitation has expired");
  }

  if (invitation.status === "accepted") {
    throw new Error("Invitation has already been used");
  }

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", invitation.email)
    .single();

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const { data: authUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email: invitation.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: `${data.firstName} ${data.lastName}`,
      },
    });

  if (createError) {
    console.error("Failed to create user:", createError);
    throw new Error(`Failed to create account: ${createError.message}`);
  }

  if (!authUser.user) {
    throw new Error("Failed to create user");
  }

  const initials = `${data.firstName[0]}${data.lastName[0]}`.toUpperCase();

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .insert({
      id: authUser.user.id,
      email: invitation.email,
      full_name: `${data.firstName} ${data.lastName}`,
      initials,
      workspace_id: invitation.workspace_id,
      role: invitation.role,
    })
    .select()
    .single();

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authUser.user.id);
    throw new Error(`Failed to create profile: ${profileError.message}`);
  }

  await supabase
    .from("invitations")
    .update({
      status: "accepted",
      auth_user_id: authUser.user.id,
    })
    .eq("id", invitation.id);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: invitation.email,
    password: data.password,
  });

  if (signInError) {
    console.error("Auto-login failed:", signInError);
  }

  await supabase.from("notifications").insert({
    user_id: authUser.user.id,
    type: "member_added",
    title: "Welcome to Prefect Hub!",
    description: `You've joined the team as a ${invitation.role}. Get started by exploring your dashboard.`,
    action_label: "Go to Dashboard",
    action_href: "/dashboard",
  });

  revalidatePath("/dashboard");

  return profile;
}
