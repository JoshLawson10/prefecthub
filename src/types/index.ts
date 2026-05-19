export type UserRole = "admin" | "prefect";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "overdue" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type LogType = "email" | "meeting" | "phone" | "note";
export type EventRole = "lead" | "member";
export type NotificationType =
  | "task_overdue"
  | "task_assigned"
  | "task_completed"
  | "rsvp"
  | "event_created"
  | "correspondence"
  | "member_added";
export type TimelineItemType =
  | "event_created"
  | "task_created"
  | "task_completed"
  | "task_overdue"
  | "email"
  | "meeting"
  | "phone"
  | "note_created"
  | "document_uploaded";

export interface Profile {
  id: string;
  full_name: string;
  initials: string;
  email: string;
  role: UserRole;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string;
  dateSort: string;
  location: string;
  status: EventStatus;
  /** Hex colour used to visually identify the event, e.g. "#4A90D9" */
  colour: string;
  max_capacity: number | null;
  rsvp_slug: string | null;
  rsvp_count: number;
  task_count: number;
  created_by: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  event_id: string;
  assigned_to: string | null;
  assignee_name: string | null;
  assignee_initials: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  due_date_sort: string | null;
  event_title: string;
}

export interface CorrespondenceLog {
  id: string;
  type: LogType;
  subject: string;
  body: string;
  contact_name: string;
  contact_email: string | null;
  logged_by_name: string;
  logged_by_initials: string;
  date: string;
  event_id: string;
}

export interface EventDocument {
  id: string;
  name: string;
  mime_type: string;
  size: string;
  uploaded_by_name: string;
  uploaded_by_initials: string;
  date: string;
  event_id: string;
}

export interface EventNote {
  id: string;
  title: string;
  body: string;
  author_name: string;
  author_initials: string;
  updated_at: string;
  event_id: string;
}

export interface EventMember {
  id: string;
  name: string;
  initials: string;
  workspace_role: UserRole;
  event_role: EventRole;
  event_id: string;
}

export interface Rsvp {
  id: string;
  event_id: string;
  name: string;
  email: string;
  guest_count: number;
  dietary_notes: string | null;
  submitted_at: string;
}

export interface TimelineEntry {
  id: string;
  type: TimelineItemType;
  title: string;
  meta: string;
  author_initials: string;
  timestamp: string;
  event_id: string;
}

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  detail?: string;
  timestamp: string;
  received_at?: string;
  read: boolean;
  event_id?: string;
  event_title?: string;
  action?: NotificationAction;
}

export interface DashboardStats {
  upcoming_events: number;
  open_tasks: number;
  overdue_tasks: number;
  total_members: number;
}

export type CalendarItemType = "event" | "task-due";

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  title: string;
  date: string;
  location?: string;
  /** Hex colour — only present for event-type items, derived from Event.colour */
  colour?: string;
  color_class: string;
  text_class: string;
}
