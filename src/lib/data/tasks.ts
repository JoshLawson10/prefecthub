import type { Task, Filters, TaskStatus, TaskStats } from "@/types/database";

export async function getTask(taskId: string): Promise<Task | null> {
  return null;
}

export async function getEventTasks(
  eventId: string,
  filters?: Filters,
): Promise<Task[] | null> {
  return null;
}

export async function getUserTasks(
  status?: TaskStatus[],
): Promise<Task[] | null> {
  return null;
}

export async function getOverdueTasks(): Promise<Task[] | null> {
  return null;
}

export async function getTasksDueSoon(days: number): Promise<Task[] | null> {
  return null;
}

export async function getTaskStats(eventId: string): Promise<TaskStats | null> {
  return null;
}
