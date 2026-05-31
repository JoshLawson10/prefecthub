import { createClient } from "@/lib/supabase/server";
import type { SearchResult } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export async function search(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const q = `%${query.trim()}%`;
  const workspaceId = currentUser.workspace_id;

  const [eventsRes, tasksRes, notesRes, corrRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, date_start, location, status, created_at")
      .eq("workspace_id", workspaceId)
      .ilike("title", q)
      .limit(5),

    supabase
      .from("tasks")
      .select("id, title, status, event_id, event:events(title), created_at")
      .eq("workspace_id", workspaceId)
      .ilike("title", q)
      .limit(5),

    supabase
      .from("notes")
      .select("id, title, event_id, event:events(title), created_at")
      .eq("workspace_id", workspaceId)
      .ilike("title", q)
      .limit(5),

    supabase
      .from("correspondence_logs")
      .select(
        "id, subject, contact_name, event_id, event:events(title), created_at",
      )
      .eq("workspace_id", workspaceId)
      .ilike("subject", q)
      .limit(5),
  ]);

  const results: SearchResult[] = [];

  eventsRes.data?.forEach((e) => {
    results.push({
      id: e.id,
      type: "event",
      title: e.title,
      description: `${e.location} · ${e.status}`,
      event_id: e.id,
      created_at: new Date(e.created_at),
    });
  });

  tasksRes.data?.forEach((t) => {
    const eventTitle =
      (t.event as unknown as { title: string } | null)?.title ??
      "Unknown event";
    results.push({
      id: t.id,
      type: "task",
      title: t.title,
      description: `${eventTitle} · ${t.status}`,
      event_id: t.event_id,
      created_at: new Date(t.created_at),
    });
  });

  notesRes.data?.forEach((n) => {
    const eventTitle =
      (n.event as unknown as { title: string } | null)?.title ??
      "Unknown event";
    results.push({
      id: n.id,
      type: "note",
      title: n.title,
      description: eventTitle,
      event_id: n.event_id,
      created_at: new Date(n.created_at),
    });
  });

  corrRes.data?.forEach((c) => {
    const eventTitle =
      (c.event as unknown as { title: string } | null)?.title ??
      "Unknown event";
    results.push({
      id: c.id,
      type: "correspondence",
      title: c.subject,
      description: `${c.contact_name} · ${eventTitle}`,
      event_id: c.event_id,
      created_at: new Date(c.created_at),
    });
  });

  return results;
}
