import { createQueryClient } from "@/lib/supabase/query";
import type { Workspace } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export async function getCurrentWorkspace(): Promise<Workspace | null> {
    const currentUser = await getCurrentUser();
    if (!currentUser?.workspace_id) return null;
    return getWorkspace(currentUser.workspace_id);
}

export async function getWorkspace(workspaceId: string): Promise<Workspace | null> {
    if (!workspaceId) {
      return null;
    }

    const supabase = createQueryClient();
    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .eq("id", workspaceId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching workspace:", error);
      return null;
    }
    return data;
}
