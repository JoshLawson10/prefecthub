import type { Event, DashboardStats } from "@/types";

const EVENTS: Event[] = [
  {
    id: "1",
    title: "Prefect Afternoon Tea",
    description:
      "An afternoon celebrating the 2026 Yr 12 cohort. Food, music, and activities — all Year 12 students welcome.",
    date: "Fri 30 May 2026",
    time: "3:00 PM - 5:00 PM",
    dateSort: "2026-05-30",
    location: "Hall B",
    status: "upcoming",
    colour: "#4A90D9",
    max_capacity: 150,
    rsvp_slug: "pat-2026",
    rsvp_count: 89,
    task_count: 5,
    created_by: "1",
  },
  {
    id: "2",
    title: "Yr 12 Assembly",
    description: null,
    date: "Mon 26 May 2026",
    time: "10:00 AM - 11:00 AM",
    dateSort: "2026-05-26",
    location: "Hall A",
    status: "upcoming",
    colour: "#E8A838",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 3,
    created_by: "2",
  },
  {
    id: "3",
    title: "Yr 7 Orientation Day",
    description: null,
    date: "Wed 18 Jun 2026",
    time: "9:00 AM - 2:00 PM",
    dateSort: "2026-06-18",
    location: "Quad",
    status: "upcoming",
    colour: "#3DAA6B",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 2,
    created_by: "1",
  },
  {
    id: "4",
    title: "Farewell Ceremony",
    description: null,
    date: "Fri 20 Jun 2026",
    time: "2:00 PM - 4:00 PM",
    dateSort: "2026-06-20",
    location: "Auditorium",
    status: "upcoming",
    colour: "#C0392B",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 1,
    created_by: "2",
  },
];

const ARCHIVED_EVENTS: Event[] = [
  {
    id: "a1",
    title: "Cross Country Carnival",
    description: null,
    date: "Fri 3 Apr 2026",
    time: "9:00 AM - 2:00 PM",
    dateSort: "2026-04-03",
    location: "School Oval",
    status: "completed",
    colour: "#7B68EE",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 12,
    task_count: 4,
    created_by: "1",
  },
  {
    id: "a2",
    title: "Swimming Carnival",
    description: null,
    date: "Thu 19 Mar 2026",
    time: "8:30 AM - 3:00 PM",
    dateSort: "2026-03-19",
    location: "Aquatic Centre",
    status: "completed",
    colour: "#20B2AA",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 6,
    created_by: "2",
  },
  {
    id: "a3",
    title: "Yr 12 Formal Planning Meeting",
    description: null,
    date: "Mon 2 Feb 2026",
    time: "3:30 PM - 4:30 PM",
    dateSort: "2026-02-02",
    location: "Library",
    status: "completed",
    colour: "#D4AC0D",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 2,
    created_by: "1",
  },
  {
    id: "a4",
    title: "Cancelled: Winter Ball",
    description: null,
    date: "Sat 13 Jun 2026",
    time: "7:00 PM - 11:00 PM",
    dateSort: "2026-06-13",
    location: "Cumberland RSL",
    status: "cancelled",
    colour: "#909090",
    max_capacity: null,
    rsvp_slug: null,
    rsvp_count: 0,
    task_count: 8,
    created_by: "2",
  },
];

export function getEvents(): Event[] {
  return [...EVENTS].sort((a, b) => a.dateSort.localeCompare(b.dateSort));
}

export function getEvent(id: string): Event | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function getArchivedEvents(): Event[] {
  return [...ARCHIVED_EVENTS].sort((a, b) =>
    b.dateSort.localeCompare(a.dateSort),
  );
}

export function getEventBySlug(slug: string): Event | undefined {
  return EVENTS.find((e) => e.rsvp_slug === slug);
}

export function getDashboardStats(): DashboardStats {
  return {
    upcoming_events: EVENTS.filter((e) => e.status === "upcoming").length,
    open_tasks: 11,
    overdue_tasks: 3,
    total_members: 7,
  };
}
