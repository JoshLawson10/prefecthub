import { z } from "zod";

export const UserRoleSchema = z.enum([
  "admin",
  "captain",
  "vice-captain",
  "prefect",
  "member",
]);
export const EventStatusSchema = z.enum([
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);
export const LogTypeSchema = z.enum(["email", "meeting", "phone", "note"]);
export const EventRoleSchema = z.enum(["lead", "member"]);
export const TaskPrioritySchema = z.enum(["high", "medium", "low"]);
export const TaskStatusSchema = z.enum([
  "todo",
  "in_progress",
  "overdue",
  "done",
]);
export const NotifTypeSchema = z.enum([
  "task_overdue",
  "task_assigned",
  "task_completed",
  "rsvp",
  "event_created",
  "correspondence",
  "member_added",
]);

export const WorkspaceSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required").max(100),
  school: z.string().min(1, "School name is required"),
  year: z.number().int().min(2000).max(2100),
  created_by: z.string().uuid(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  full_name: z.string().min(1, "Full name is required"),
  initials: z.string().min(1).max(3),
  avatar_url: z.string().url().nullable().optional(),
  workspace_id: z.uuid().nullable(),
  role: UserRoleSchema.default("member"),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
});

export const InvitationSchema = z.object({
  id: z.uuid(),
  email: z.email("Invalid email address"),
  workspace_id: z.uuid(),
  role: UserRoleSchema,
  invited_by: z.uuid(),
  token: z.string().min(1),
  expires_at: z
    .date()
    .default(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  created_at: z.date().default(() => new Date()),
});

export const EventSchema = z
  .object({
    id: z.uuid(),
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().nullable().optional(),
    date_start: z.date(),
    date_end: z.date(),
    location: z.string().min(1, "Location is required"),
    status: EventStatusSchema.default("upcoming"),
    colour: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
    max_capacity: z.number().int().positive().nullable().optional(),
    rsvp_slug: z.string().nullable().optional(),
    created_by: z.uuid(),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
    workspace_id: z.uuid(),
  })
  .refine((data) => data.date_end > data.date_start, {
    message: "End date must be after start date",
    path: ["date_end"],
  });

export const TaskSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().nullable().optional(),
  assigned_to: z.uuid().nullable(),
  priority: TaskPrioritySchema.default("medium"),
  status: TaskStatusSchema.default("todo"),
  due_date: z.date().nullable().optional(),
  created_by: z.uuid(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
  workspace_id: z.uuid(),
});

export const RSVPSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  guest_count: z.number().int().min(1, "Guest count must be at least 1"),
  dietary_notes: z.string().nullable().optional(),
  created_at: z.date().default(() => new Date()),
});

export const CorrespondenceLogSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  type: LogTypeSchema,
  subject: z.string().min(1, "Subject is required"),
  body: z.string().nullable().optional(),
  contact_name: z.string().min(1, "Contact name is required"),
  contact_email: z.email().nullable().optional(),
  logged_by: z.uuid(),
  created_at: z.date().default(() => new Date()),
  workspace_id: z.uuid(),
});

export const NoteSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  title: z.string().min(1, "Title is required"),
  body: z.string().nullable().optional(),
  author_id: z.uuid(),
  created_at: z.date().default(() => new Date()),
  updated_at: z.date().default(() => new Date()),
  workspace_id: z.uuid(),
});

export const DocumentSchema = z.object({
  id: z.uuid(),
  event_id: z.uuid(),
  name: z.string().min(1, "Document name is required"),
  storage_path: z.string().min(1),
  mime_type: z.string().min(1),
  size_bytes: z.number().int().min(0),
  uploaded_by: z.uuid(),
  created_at: z.date().default(() => new Date()),
  workspace_id: z.uuid(),
});

export const NotificationSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  type: NotifTypeSchema,
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  detail: z.string().nullable().optional(),
  event_id: z.uuid().nullable(),
  action_label: z.string().nullable().optional(),
  action_href: z.string().nullable().optional(),
  read: z.boolean().default(false),
  created_at: z.date().default(() => new Date()),
});

export const InsertWorkspaceSchema = WorkspaceSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const InsertUserSchema = UserSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const InsertEventSchema = EventSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  rsvp_slug: true,
});

export const InsertTaskSchema = TaskSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const InsertRSVPSchema = RSVPSchema.omit({
  id: true,
  created_at: true,
});

export const InsertCorrespondenceLogSchema = CorrespondenceLogSchema.omit({
  id: true,
  created_at: true,
});

export const InsertNoteSchema = NoteSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const InsertDocumentSchema = DocumentSchema.omit({
  id: true,
  created_at: true,
});

export const UpdateWorkspaceSchema = InsertWorkspaceSchema.partial();
export const UpdateUserSchema = InsertUserSchema.partial();
export const UpdateEventSchema = InsertEventSchema.partial();
export const UpdateTaskSchema = InsertTaskSchema.partial();
export const UpdateRSVPSchema = InsertRSVPSchema.partial();

export const EventFiltersSchema = z.object({
  status: z.array(EventStatusSchema).optional(),
  dateRange: z
    .object({
      start: z.date(),
      end: z.date(),
    })
    .optional(),
  assignedToMe: z.boolean().optional(),
});

export const PaginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const FiltersSchema = z
  .object({
    status: z.array(z.string()).optional(),
    dateRange: z
      .object({
        start: z.date(),
        end: z.date(),
      })
      .optional(),
    assignedTo: z.string().optional(),
    priority: z.array(TaskPrioritySchema).optional(),
  })
  .optional();

export type UserRole = z.infer<typeof UserRoleSchema>;
export type EventStatus = z.infer<typeof EventStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type User = z.infer<typeof UserSchema>;
export type Invitation = z.infer<typeof InvitationSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type RSVP = z.infer<typeof RSVPSchema>;
export type CorrespondenceLog = z.infer<typeof CorrespondenceLogSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type Document = z.infer<typeof DocumentSchema>;
export type Notification = z.infer<typeof NotificationSchema>;

export type InsertWorkspace = z.infer<typeof InsertWorkspaceSchema>;
export type InsertUser = z.infer<typeof InsertUserSchema>;
export type InsertEvent = z.infer<typeof InsertEventSchema>;
export type InsertTask = z.infer<typeof InsertTaskSchema>;
export type InsertRSVP = z.infer<typeof InsertRSVPSchema>;

export type UpdateWorkspace = z.infer<typeof UpdateWorkspaceSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UpdateEvent = z.infer<typeof UpdateEventSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

export type EventFilters = z.infer<typeof EventFiltersSchema>;
export type Filters = z.infer<typeof FiltersSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
