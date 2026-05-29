import { createClient } from "@/lib/supabase/server";
import type { Workspace } from "@/lib/schemas";

export async function getWorkspace(
  workspaceId: string,
): Promise<Workspace | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (error) {
    console.error("Error fetching workspace:", error);
    return null;
  }

  return data;
}

export async function getCurrentWorkspace(): Promise<Workspace | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("workspace_id")
    .eq("id", user.id)
    .single();

  if (!userData?.workspace_id) return null;

  return getWorkspace(userData.workspace_id);
}
