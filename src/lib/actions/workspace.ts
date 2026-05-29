import { Workspace } from "@/lib/schemas";

export async function createWorkspace(
  data: Omit<Workspace, "id" | "created_at" | "updated_at">,
  userId: string,
): Promise<Workspace> {
  return null;
}

export async function updateWorkspace(
  workspaceId: string,
  data: Partial<Workspace>,
): Promise<Workspace> {
  return null;
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  return null;
}
