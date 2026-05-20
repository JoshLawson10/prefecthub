"use server";

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
  console.log("[action] createTask", input);
  // TODO: insert into tasks table
}

export interface UpdateTaskStatusInput {
  taskId: string;
  status: TaskStatus;
}

export async function updateTaskStatus(input: UpdateTaskStatusInput): Promise<void> {
  console.log("[action] updateTaskStatus", input);
  // TODO: update tasks.status where id = taskId
}

export async function deleteTask(taskId: string): Promise<void> {
  console.log("[action] deleteTask", { taskId });
  // TODO: delete from tasks table where id = taskId
}
