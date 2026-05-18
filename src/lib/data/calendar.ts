import type { CalendarItem } from "@/types";

const CALENDAR_ITEMS: CalendarItem[] = [
  {
    id: "e1",
    type: "event",
    title: "Prefect Afternoon Tea",
    date: "2026-05-30",
    location: "Hall B",
    color_class: "bg-blue-500/10 dark:bg-blue-500/20",
    text_class: "text-blue-700 dark:text-blue-400",
  },
  {
    id: "e2",
    type: "event",
    title: "Yr 12 Assembly",
    date: "2026-05-26",
    location: "Hall A",
    color_class: "bg-amber-500/10 dark:bg-amber-500/20",
    text_class: "text-amber-700 dark:text-amber-400",
  },
  {
    id: "e3",
    type: "event",
    title: "Yr 7 Orientation Day",
    date: "2026-06-18",
    location: "Quad",
    color_class: "bg-emerald-500/10 dark:bg-emerald-500/20",
    text_class: "text-emerald-700 dark:text-emerald-400",
  },
  {
    id: "e4",
    type: "event",
    title: "Farewell Ceremony",
    date: "2026-06-20",
    location: "Auditorium",
    color_class: "bg-rose-500/10 dark:bg-rose-500/20",
    text_class: "text-rose-700 dark:text-rose-400",
  },
  {
    id: "t1",
    type: "task-due",
    title: "Book catering for PAT",
    date: "2026-05-20",
    color_class: "bg-destructive/10",
    text_class: "text-destructive",
  },
  {
    id: "t2",
    type: "task-due",
    title: "Design RSVP form",
    date: "2026-05-22",
    color_class: "bg-muted",
    text_class: "text-muted-foreground",
  },
  {
    id: "t3",
    type: "task-due",
    title: "Post Instagram reminder",
    date: "2026-05-26",
    color_class: "bg-muted",
    text_class: "text-muted-foreground",
  },
  {
    id: "t4",
    type: "task-due",
    title: "Prepare assembly run sheet",
    date: "2026-05-24",
    color_class: "bg-muted",
    text_class: "text-muted-foreground",
  },
];

export function getCalendarItems(): CalendarItem[] {
  return [...CALENDAR_ITEMS];
}
