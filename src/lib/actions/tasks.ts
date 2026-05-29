import type { Task, TaskStatus } from "@/types/database";

export async function createTask(
  data: Omit<Task, "id" | "created_at" | "updated_at">,
): Promise<Task | null> {
  return null;
}

export async function updateTask(
  taskId: string,
  data: Partial<Task>,
): Promise<Task | null> {
  return null;
}

export async function deleteTask(taskId: string): Promise<null> {
  return null;
}

export async function assignTask(
  taskId: string,
  userId: string,
): Promise<Task | null> {
  return null;
}

export async function unassignTask(taskId: string): Promise<Task | null> {
  return null;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<Task | null> {
  return null;
}

export async function reorderTasks(
  eventId: string,
  taskOrder: string[],
): Promise<null> {
  return null;
}

export async function bulkCreateTasks(
  eventId: string,
  tasks: Omit<
    Task,
    "id" | "event_id" | "created_at" | "updated_at" | "workspace_id"
  >[],
): Promise<Task[] | null> {
  return null;
}

export async function bulkUpdateTaskStatus(
  taskIds: string[],
  status: TaskStatus,
): Promise<null> {
  return null;
}

export async function bulkDeleteTasks(taskIds: string[]): Promise<null> {
  return null;
}
