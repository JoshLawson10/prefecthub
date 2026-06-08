"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";
import type { TaskPriority, TaskStatus } from "@/types";

export interface CreateTaskInput {
  eventId: string;
  title: string;
  description: string | null;
  assigneeId: string | null;
  priority: TaskPriority;
  dueDate: Date | null;
}

export async function createTask(input: CreateTaskInput): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase.from("tasks").insert({
    event_id: input.eventId,
    title: input.title,
    description: input.description,
    assigned_to: input.assigneeId,
    priority: input.priority,
    due_date: input.dueDate ? input.dueDate.toISOString().split("T")[0] : null,
    created_by: currentUser.id,
    workspace_id: currentUser.workspace_id,
  });

  if (error) throw new Error(error.message);
}

export async function updateTaskStatus(input: {
  taskId: string;
  status: TaskStatus;
}): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("tasks")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.taskId)
    .eq("workspace_id", currentUser.workspace_id);
  if (error) throw new Error(error.message);
}

export async function deleteTask(taskId: string): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("workspace_id", currentUser.workspace_id);
  if (error) throw new Error(error.message);
}
