import type { CalendarItem } from "@/types";
import { getEvents } from "./events";
import { getTasks } from "./tasks";

/**
 * Converts a hex colour into Tailwind-compatible inline-style-ready values.
 * We use CSS custom properties at runtime since Tailwind can't generate
 * arbitrary hex-based utility classes at build time.
 */
function hexToCalendarClasses(_hex: string) {
  // color_class / text_class are used with cn() in the calendar components.
  // For event items we apply the colour via an inline style instead,
  // so these are intentionally empty — see CalendarView / EventChip.
  return { color_class: "", text_class: "" };
}

export async function getCalendarItems(): Promise<CalendarItem[]> {
  const events = await getEvents();
  const tasks = await getTasks();

  const eventItems: CalendarItem[] = events.map((e) => ({
    id: e.id,
    type: "event",
    title: e.title,
    date: e.dateSort,
    location: e.location,
    colour: e.colour,
    ...hexToCalendarClasses(e.colour),
  }));

  const taskItems: CalendarItem[] = tasks
    .filter((t) => t.due_date && t.status !== "done")
    .map((t) => ({
      id: `task-${t.id}`,
      type: "task-due",
      title: t.title,
      date: t.due_date!,
      color_class: "bg-muted",
      text_class: "text-muted-foreground",
    }));

  return [...eventItems, ...taskItems];
}
