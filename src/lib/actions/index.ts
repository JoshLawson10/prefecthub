import type { TaskPriority, TaskStatus, EventRole, LogType } from "@/types";

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

export interface CreateNoteInput {
  eventId: string;
  title: string;
  body: string;
}

export async function createNote(input: CreateNoteInput): Promise<void> {
  console.log("[action] createNote", input);
  // TODO: insert into notes table
}

export interface LogCorrespondenceInput {
  eventId: string;
  type: LogType;
  subject: string;
  body: string;
  contactName: string;
  contactEmail: string | null;
}

export async function logCorrespondence(
  input: LogCorrespondenceInput,
): Promise<void> {
  console.log("[action] logCorrespondence", input);
  // TODO: insert into correspondence_logs table
}

export interface UploadDocumentInput {
  eventId: string;
  file: File;
}

export async function uploadDocument(
  input: UploadDocumentInput,
): Promise<void> {
  console.log("[action] uploadDocument", {
    eventId: input.eventId,
    name: input.file.name,
    size: input.file.size,
    type: input.file.type,
  });
  // TODO: upload to Supabase Storage, then insert into documents table
}

export async function deleteDocument(documentId: string): Promise<void> {
  console.log("[action] deleteDocument", { documentId });
  // TODO: delete from Supabase Storage, then delete from documents table
}

export interface SubmitRsvpInput {
  eventId: string;
  name: string;
  email: string;
  guestCount: number;
  dietaryNotes: string | null;
}

export async function submitRsvp(input: SubmitRsvpInput): Promise<void> {
  console.log("[action] submitRsvp", input);
  // TODO: insert into rsvps table
}
