import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getWorkspace(workspaceId: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserWorkspace(userId: string) {
  const { data, error } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) throw error;

  return data?.workspace_id ?? null;
}
