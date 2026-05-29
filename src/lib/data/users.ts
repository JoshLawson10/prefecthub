import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { User } from "@/lib/schemas";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
});

export async function getUser(userId: string): Promise<User | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function getWorkspaceMembers(): Promise<User[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const supabase = await createClient();

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

export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient();

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
  return user?.role || null;
}
