import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cache } from "react";
import type { User } from "@/lib/schemas";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  // Use the regular client only for the auth check (needs the session cookie)
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Use the admin client for all DB reads/writes so RLS never blocks
  // a legitimate server-side profile lookup.
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error || !data) {
    // Auto-create a minimal profile for OAuth / magic-link users who
    // bypass the normal onboarding flow.
    const fullName =
      authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User";
    const initials = fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const { data: newProfile, error: insertError } = await admin
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email,
        full_name: fullName,
        initials,
        role: "member",
        workspace_id: null,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to create user profile:", insertError.message);
      return null;
    }

    return newProfile;
  }

  return data;
});

export const getUser = cache(async (userId: string): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
});

export async function getWorkspaceMembers(): Promise<User[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("workspace_id", currentUser.workspace_id)
    .order("full_name");

  if (error) {
    console.error("Error fetching workspace members:", error);
    return [];
  }
  return data;
}

export async function getMembersByRole(): Promise<Record<string, User[]>> {
  const members = await getWorkspaceMembers();
  return members.reduce(
    (acc, member) => {
      (acc[member.role] ??= []).push(member);
      return acc;
    },
    {} as Record<string, User[]>,
  );
}

export const getUserByEmail = cache(
  async (email: string): Promise<User | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) return null;
    return data;
  },
);

export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

export const getMembers = getWorkspaceMembers;
export const getMember = getUser;
