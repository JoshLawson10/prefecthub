import type { TaskPriority, TaskStatus } from "@/types";

export interface CreateEventInput {
  title: string;
  description: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  collectRsvps: boolean;
  maxCapacity: number | null;
}

export async function createEvent(input: CreateEventInput): Promise<void> {
  console.log("[action] createEvent", input);
  // TODO: insert into events table
}

export async function restoreEvent(eventId: string): Promise<void> {
  console.log("[action] restoreEvent", { eventId });
  // TODO: set events.status = 'upcoming' where id = eventId
}

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

export async function updateTaskStatus(
  input: UpdateTaskStatusInput,
): Promise<void> {
  console.log("[action] updateTaskStatus", input);
  // TODO: update tasks.status where id = taskId
}
