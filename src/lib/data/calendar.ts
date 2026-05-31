import type { CalendarItem } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";
import { getEventsByDateRange } from "@/lib/data/events";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";

export async function getCalendarItems(month?: Date): Promise<CalendarItem[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const target = month ?? new Date();
  const rangeStart = startOfMonth(target);
  const rangeEnd = endOfMonth(addMonths(target, 0));

  const [events, tasksRes] = await Promise.all([
    getEventsByDateRange(rangeStart, rangeEnd),
    supabase
      .from("tasks")
      .select("id, title, due_date, status")
      .eq("workspace_id", currentUser.workspace_id)
      .not("status", "in", '("done")')
      .not("due_date", "is", null)
      .gte("due_date", format(rangeStart, "yyyy-MM-dd"))
      .lte("due_date", format(rangeEnd, "yyyy-MM-dd")),
  ]);

  const eventItems: CalendarItem[] = events.map((e) => ({
    id: e.id,
    type: "event",
    title: e.title,
    date: format(new Date(e.date_start), "yyyy-MM-dd"),
    location: e.location,
    colour: e.colour,
    color_class: "",
    text_class: "",
  }));

  const taskItems: CalendarItem[] = (tasksRes.data ?? []).map((t) => ({
    id: `task-${t.id}`,
    type: "task-due",
    title: t.title,
    date: t.due_date as string,
    color_class: t.status === "overdue" ? "bg-destructive/10" : "bg-muted",
    text_class:
      t.status === "overdue" ? "text-destructive" : "text-muted-foreground",
  }));

  return [...eventItems, ...taskItems];
}
