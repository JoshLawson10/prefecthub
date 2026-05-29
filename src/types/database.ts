export type UserRole =
  | "admin"
  | "captain"
  | "vice-captain"
  | "prefect"
  | "member";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type LogType = "email" | "meeting" | "phone" | "note";
export type EventRole = "lead" | "member";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "overdue" | "done";
export type NotifType =
  | "task_overdue"
  | "task_assigned"
  | "task_completed"
  | "rsvp"
  | "event_created"
  | "correspondence"
  | "member_added";

export interface Workspace {
  id: string;
  name: string;
  school: string;
  year: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  initials: string;
  avatar_url: string | null;
  workspace_id: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Invitation {
  id: string;
  email: string;
  workspace_id: string;
  role: UserRole;
  invited_by: string;
  token: string;
  expires_at: Date;
  created_at: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date_start: Date;
  date_end: Date;
  location: string;
  status: EventStatus;
  colour: string;
  max_capacity: number | null;
  rsvp_slug: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  workspace_id: string;
}

export interface EventMember {
  id: string;
  event_id: string;
  user_id: string;
  event_role: EventRole;
  created_at: Date;
}

export interface Task {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  assigned_to: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: Date | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  workspace_id: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  name: string;
  email: string;
  guest_count: number;
  dietary_notes: string | null;
  created_at: Date;
}

export interface CorrespondenceLog {
  id: string;
  event_id: string;
  type: LogType;
  subject: string;
  body: string | null;
  contact_name: string;
  contact_email: string | null;
  logged_by: string;
  created_at: Date;
  workspace_id: string;
}

export interface Note {
  id: string;
  event_id: string;
  title: string;
  body: string | null;
  author_id: string;
  created_at: Date;
  updated_at: Date;
  workspace_id: string;
}

export interface Document {
  id: string;
  event_id: string;
  name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: Date;
  workspace_id: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotifType;
  title: string;
  description: string | null;
  detail: string | null;
  event_id: string | null;
  action_label: string | null;
  action_href: string | null;
  read: boolean;
  created_at: Date;
}

export interface EventStats {
  totalRSVPs: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalMembers: number;
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  overdue: number;
  done: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface RSVPStats {
  total: number;
  totalGuests: number;
  averageGuestsPerRSVP: number;
  withDietaryRestrictions: number;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalRSVPs: number;
  pendingRSVPs: number;
  totalMembers: number;
  activeMembers: number;
}

export interface UserProductivity {
  tasksCompleted: number;
  tasksOverdue: number;
  eventsOrganized: number;
  notesWritten: number;
  correspondenceLogged: number;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: Date;
  user: User;
  event?: Event;
}

export interface SearchResult {
  type: "event" | "task" | "note" | "correspondence";
  id: string;
  title: string;
  description: string | null;
  created_at: Date;
  event_id?: string;
}

export interface Filters {
  status?: string[];
  dateRange?: { start: Date; end: Date };
  assignedTo?: string;
  priority?: TaskPriority[];
}

export interface Pagination {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
