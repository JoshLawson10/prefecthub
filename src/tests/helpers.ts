import { vi } from "vitest";
import type {
  User,
  Event,
  Task,
  Note,
  CorrespondenceLog,
  Document,
  RSVP,
  Notification,
  Workspace,
} from "@/lib/schemas";

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    email: "test@example.com",
    full_name: "Test User",
    initials: "TU",
    avatar_url: null,
    workspace_id: "ws-1",
    role: "member",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeWorkspace(overrides: Partial<Workspace> = {}): Workspace {
  return {
    id: "ws-1",
    name: "Test Workspace",
    school: "Test School",
    year: 2026,
    created_by: "user-1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: "event-1",
    title: "Test Event",
    description: null,
    date_start: "2026-06-01T09:00:00Z",
    date_end: "2026-06-01T11:00:00Z",
    location: "Hall A",
    status: "upcoming",
    colour: "#3B82F6",
    max_capacity: null,
    rsvp_slug: null,
    created_by: "user-1",
    workspace_id: "ws-1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    event_id: "event-1",
    title: "Test Task",
    description: null,
    assigned_to: null,
    priority: "medium",
    status: "todo",
    due_date: null,
    created_by: "user-1",
    workspace_id: "ws-1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "note-1",
    event_id: "event-1",
    title: "Test Note",
    body: "Test body",
    author_id: "user-1",
    workspace_id: "ws-1",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeCorrespondence(
  overrides: Partial<CorrespondenceLog> = {},
): CorrespondenceLog {
  return {
    id: "log-1",
    event_id: "event-1",
    type: "email",
    subject: "Test Subject",
    body: "Test body",
    contact_name: "Jane Doe",
    contact_email: "jane@example.com",
    logged_by: "user-1",
    workspace_id: "ws-1",
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeDocument(overrides: Partial<Document> = {}): Document {
  return {
    id: "doc-1",
    event_id: "event-1",
    name: "test.pdf",
    storage_path: "event-1/test.pdf",
    mime_type: "application/pdf",
    size_bytes: 1024,
    uploaded_by: "user-1",
    workspace_id: "ws-1",
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeRsvp(overrides: Partial<RSVP> = {}): RSVP {
  return {
    id: "rsvp-1",
    event_id: "event-1",
    name: "Alice Smith",
    email: "alice@example.com",
    guest_count: 1,
    dietary_notes: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeNotification(
  overrides: Partial<Notification> = {},
): Notification {
  return {
    id: "notif-1",
    user_id: "user-1",
    type: "task_assigned",
    title: "New Task",
    description: "You have a new task",
    detail: null,
    event_id: "event-1",
    action_label: null,
    action_href: null,
    read: false,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

export function makeSupabaseMock(
  response: { data?: unknown; error?: unknown; count?: number } = {},
) {
  const { data = null, error = null, count = null } = response;

  const builder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data, error }),
    single: vi.fn().mockResolvedValue({ data, error }),
    then: (
      resolve: (value: {
        data: unknown;
        error: unknown;
        count: number | null;
      }) => void,
    ) => Promise.resolve({ data, error, count }).then(resolve),
  };

  const storage = {
    from: vi.fn().mockReturnValue({
      createSignedUrl: vi.fn().mockResolvedValue({
        data: { signedUrl: "https://signed.url/file" },
        error: null,
      }),
      upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
      remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi
        .fn()
        .mockReturnValue({ data: { publicUrl: "https://public.url/file" } }),
    }),
  };

  return {
    from: vi.fn().mockReturnValue(builder),
    storage,
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "user-1",
            email: "test@example.com",
            user_metadata: {},
          },
        },
        error: null,
      }),
    },
    _builder: builder,
  };
}
