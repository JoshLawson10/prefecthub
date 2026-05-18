import type { EventCardData } from "@/components/events/event-card";

const ARCHIVED_EVENTS: EventCardData[] = [
  {
    id: "a1",
    title: "Cross Country Carnival",
    datetime: { dateLabel: "Fri 3 Apr 2026", timeLabel: "9:00 AM - 2:00 PM" },
    location: { label: "School Oval" },
    status: "completed",
    stats: { tasksCount: 4, rsvpsCount: 12 },
  },
  {
    id: "a2",
    title: "Swimming Carnival",
    datetime: { dateLabel: "Thu 19 Mar 2026", timeLabel: "8:30 AM - 3:00 PM" },
    location: { label: "Aquatic Centre" },
    status: "completed",
    stats: { tasksCount: 6, rsvpsCount: 0 },
  },
  {
    id: "a3",
    title: "Yr 12 Formal Planning Meeting",
    datetime: { dateLabel: "Mon 2 Feb 2026", timeLabel: "3:30 PM - 4:30 PM" },
    location: { label: "Library" },
    status: "completed",
    stats: { tasksCount: 2, rsvpsCount: 0 },
  },
  {
    id: "a4",
    title: "Cancelled: Winter Ball",
    datetime: { dateLabel: "Sat 13 Jun 2026", timeLabel: "7:00 PM - 11:00 PM" },
    location: { label: "Cumberland RSL" },
    status: "cancelled",
    stats: { tasksCount: 8, rsvpsCount: 0 },
  },
];

export function getArchivedEvents(): EventCardData[] {
  return [...ARCHIVED_EVENTS];
}
