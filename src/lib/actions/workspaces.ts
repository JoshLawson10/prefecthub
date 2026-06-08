"use server";

import { createClient } from "@/lib/supabase/server";
import {
  InsertWorkspaceSchema,
  UpdateWorkspaceSchema,
  type Workspace,
} from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWorkspace(
  data: Omit<Workspace, "id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Workspace> {
  const supabase = await createClient();

  const validatedData = InsertWorkspaceSchema.parse(data);

  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert(validatedData)
    .select()
    .single();

  if (workspaceError)
    throw new Error(`Failed to create workspace: ${workspaceError.message}`);

  const { error: userError } = await supabase
    .from("users")
    .update({ workspace_id: workspace.id, role: "admin" })
    .eq("id", userId);

  if (userError) throw new Error(`Failed to update user: ${userError.message}`);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateWorkspace(
  workspaceId: string,
  data: Partial<Workspace>,
): Promise<Workspace> {
  const supabase = await createClient();

  const validatedData = UpdateWorkspaceSchema.parse(data);

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .update(validatedData)
    .eq("id", workspaceId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update workspace: ${error.message}`);

  revalidatePath(`/workspaces/${workspaceId}`);

  return workspace;
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not authenticated");
  if (currentUser.workspace_id !== workspaceId) {
    throw new Error("You do not have permission to delete this workspace");
  }
  if (currentUser.role !== "admin") {
    throw new Error("Only admins can delete a workspace");
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);

  if (error) throw new Error(`Failed to delete workspace: ${error.message}`);

  revalidatePath("/");
  redirect("/onboarding");
}
