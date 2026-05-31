"use server";

import { createClient } from "@/lib/supabase/server";
import { type User, type UserRole, type Invitation } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { getCurrentUser } from "@/lib/data/users";

export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
): Promise<User> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update user: ${error.message}`);

  revalidatePath("/settings/profile");

  return user;
}

export async function updateUserAvatar(
  userId: string,
  file: File,
): Promise<{ avatar_url: string }> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError)
    throw new Error(`Failed to upload avatar: ${uploadError.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: publicUrl })
    .eq("id", userId)
    .select()
    .single();

  if (updateError)
    throw new Error(`Failed to update user avatar: ${updateError.message}`);

  revalidatePath("/settings/profile");

  return { avatar_url: publicUrl };
}

export async function deleteUserAvatar(userId: string): Promise<void> {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("avatar_url")
    .eq("id", userId)
    .single();

  if (user?.avatar_url) {
    const path = user.avatar_url.split("/").pop();
    if (path) {
      await supabase.storage.from("avatars").remove([path]);
    }
  }

  const { error } = await supabase
    .from("users")
    .update({ avatar_url: null })
    .eq("id", userId);

  if (error) throw new Error(`Failed to delete avatar: ${error.message}`);

  revalidatePath("/settings/profile");
}

export async function inviteToWorkspace(
  email: string,
  role: UserRole,
): Promise<Invitation> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.workspace_id) {
    throw new Error("No workspace found");
  }

  const token = randomBytes(32).toString("hex");

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      email,
      workspace_id: currentUser.workspace_id,
      role,
      invited_by: currentUser.id,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create invitation: ${error.message}`);

  // TODO: Send email with invite link

  return invitation;
}

export async function removeFromWorkspace(userId: string): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.workspace_id) throw new Error("No workspace found");

  const { count } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("workspace_id", currentUser.workspace_id)
    .eq("role", "admin");

  if (count === 1) {
    const { data: userToRemove } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    if (userToRemove?.role === "admin") {
      throw new Error("Cannot remove the last admin from workspace");
    }
  }

  const { error } = await supabase
    .from("users")
    .update({ workspace_id: null, role: "member" })
    .eq("id", userId);

  if (error) throw new Error(`Failed to remove user: ${error.message}`);

  revalidatePath("/settings/members");
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<User> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.workspace_id) throw new Error("No workspace found");

  if (role !== "admin") {
    const { count } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", currentUser.workspace_id)
      .eq("role", "admin");

    if (count === 1) {
      const { data: userToUpdate } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userToUpdate?.role === "admin") {
        throw new Error("Cannot demote the last admin");
      }
    }
  }

  const { data: user, error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update user role: ${error.message}`);

  revalidatePath("/settings/members");

  return user;
}

export async function acceptInvitation(
  token: string,
  userData: { full_name: string; password: string },
): Promise<User> {
  const supabase = await createClient();

  const { data: invitation, error: inviteError } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (inviteError || !invitation) {
    throw new Error("Invalid or expired invitation");
  }

  if (new Date(invitation.expires_at) < new Date()) {
    throw new Error("Invitation has expired");
  }

  const { data: authUser, error: signUpError } = await supabase.auth.signUp({
    email: invitation.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.full_name,
      },
    },
  });

  if (signUpError)
    throw new Error(`Failed to create account: ${signUpError.message}`);

  if (!authUser.user) throw new Error("Failed to create user");

  const initials = userData.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const { data: user, error: userError } = await supabase
    .from("users")
    .insert({
      id: authUser.user.id,
      email: invitation.email,
      full_name: userData.full_name,
      initials,
      workspace_id: invitation.workspace_id,
      role: invitation.role,
    })
    .select()
    .single();

  if (userError)
    throw new Error(`Failed to create user record: ${userError.message}`);

  await supabase.from("invitations").delete().eq("id", invitation.id);

  return user;
}
