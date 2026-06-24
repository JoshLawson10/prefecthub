import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createQueryClient } from "@/lib/supabase/query";
import type { User } from "@/lib/schemas";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error || !data) {
    const fullName =
      authUser.user_metadata?.full_name ||
      authUser.email?.split("@")[0] ||
      "User";
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
}

export async function getUser(userId: string): Promise<User | null> {
  const supabase = createQueryClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function getWorkspaceMembers(): Promise<User[]> {
  const supabase = createQueryClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("workspace_id", currentUser.workspace_id)
    .order("full_name");

  if (error) {
    console.error("Error fetching workspace members:", error.message);
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

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = createQueryClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.role ?? null;
}

export const getMembers = getWorkspaceMembers;
export const getMember = getUser;
