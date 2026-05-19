import type { TaskPriority, TaskStatus, EventRole } from "@/types";

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

export interface AssignTeamMemberInput {
  eventId: string;
  memberId: string;
  role: EventRole;
}

export async function assignTeamMember(
  input: AssignTeamMemberInput,
): Promise<void> {
  console.log("[action] assignTeamMember", input);
  // TODO: insert into event_members table
}

export interface UpdateMemberRoleInput {
  memberId: string;
  newRole: "admin" | "prefect";
}

export async function updateMemberRole(
  input: UpdateMemberRoleInput,
): Promise<void> {
  console.log("[action] updateMemberRole", input);
  // TODO: update profiles.role where id = memberId
}

export async function removeMember(memberId: string): Promise<void> {
  console.log("[action] removeMember", { memberId });
  // TODO: delete from workspace_members where member_id = memberId
}

export async function inviteMember(email: string): Promise<void> {
  console.log("[action] inviteMember", { email });
  // TODO: send invite email via Supabase auth / email provider
}
