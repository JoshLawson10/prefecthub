import type { Notification } from "@/types";

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "task_overdue",
    title: "Task overdue",
    description:
      "Book catering for PAT — assigned to you · Prefect Afternoon Tea",
    detail:
      "The task 'Book catering for PAT' was due on 20 May 2026 and has not been marked complete. It is assigned to you with High priority. The Prefect Afternoon Tea is on 30 May — catering needs to be confirmed as soon as possible.",
    timestamp: "Today",
    received_at: "2026-05-19T08:14:00",
    read: false,
    event_id: "1",
    event_title: "Prefect Afternoon Tea",
    action: { label: "View task", href: "/events/1/tasks" },
  },
  {
    id: "n2",
    type: "rsvp",
    title: "New RSVP",
    description:
      "Emily Zhang submitted an RSVP for Prefect Afternoon Tea (2 guests)",
    detail:
      "Emily Zhang (emily.zhang@student.edu.au) has submitted an RSVP for the Prefect Afternoon Tea. She is bringing 1 additional guest (2 total) and noted a vegetarian dietary requirement. The event now has 89 of 150 spots filled.",
    timestamp: "Today",
    received_at: "2026-05-19T07:52:00",
    read: false,
    event_id: "1",
    event_title: "Prefect Afternoon Tea",
    action: { label: "View RSVPs", href: "/events/1" },
  },
  {
    id: "n3",
    type: "task_assigned",
    title: "Task assigned to you",
    description: "Design RSVP form — assigned by Sophie Nguyen · Due 22 May",
    detail:
      "Sophie Nguyen assigned you the task 'Design RSVP form' for the Prefect Afternoon Tea. This task is due on 22 May 2026 and has Medium priority. The RSVP form should be a public link generated from Prefect Hub so responses feed directly into the event dashboard.",
    timestamp: "12 May",
    received_at: "2026-05-12T14:30:00",
    read: false,
    event_id: "1",
    event_title: "Prefect Afternoon Tea",
    action: { label: "View task", href: "/events/1/tasks" },
  },
  {
    id: "n4",
    type: "task_completed",
    title: "Task completed",
    description: "Draft P&C funding letter — completed by Josh Lawson",
    detail:
      "Josh Lawson marked the task 'Draft P&C funding letter' as complete on 11 May 2026. The letter has been drafted and is ready to submit to the P&C for the $650 catering funding request.",
    timestamp: "11 May",
    received_at: "2026-05-11T16:05:00",
    read: true,
    event_id: "1",
    event_title: "Prefect Afternoon Tea",
    action: { label: "View tasks", href: "/events/1/tasks" },
  },
  {
    id: "n5",
    type: "correspondence",
    title: "Correspondence logged",
    description:
      "Email logged — PAT catering budget approval · Prefect Afternoon Tea",
    detail:
      "Josh Lawson logged an email correspondence entry for the Prefect Afternoon Tea: 'PAT catering budget approval'. The email was sent to Ms Carter (Deputy Principal) requesting $650 from the P&C to cover catering costs.",
    timestamp: "12 May",
    received_at: "2026-05-12T09:18:00",
    read: true,
    event_id: "1",
    event_title: "Prefect Afternoon Tea",
    action: { label: "View correspondence", href: "/events/1/correspondence" },
  },
  {
    id: "n6",
    type: "event_created",
    title: "New event created",
    description:
      "Farewell Ceremony added for Fri 20 Jun · Created by Sophie Nguyen",
    detail:
      "Sophie Nguyen created a new event: 'Farewell Ceremony' scheduled for Friday 20 June 2026, 2:00 PM - 4:00 PM in the Auditorium. You have been added to the workspace for this event.",
    timestamp: "10 May",
    received_at: "2026-05-10T11:44:00",
    read: true,
    event_id: "4",
    event_title: "Farewell Ceremony",
    action: { label: "View event", href: "/events/4" },
  },
  {
    id: "n7",
    type: "task_overdue",
    title: "Task overdue",
    description: "Confirm AV equipment for assembly — assigned to Alex Kim",
    detail:
      "The task 'Confirm AV equipment for assembly' was due on 15 May 2026. It is assigned to Alex Kim with High priority for the Yr 12 Assembly on 26 May. This should be followed up urgently.",
    timestamp: "9 May",
    received_at: "2026-05-09T08:00:00",
    read: true,
    event_id: "2",
    event_title: "Yr 12 Assembly",
    action: { label: "View task", href: "/events/2/tasks" },
  },
  {
    id: "n8",
    type: "member_added",
    title: "Member joined",
    description: "Emma Chen joined the workspace",
    detail:
      "Emma Chen has accepted their invitation and joined the Prefect Hub workspace. They have been added as a Prefect. You can assign tasks and add them to events from the Members page.",
    timestamp: "5 Feb",
    received_at: "2026-02-05T10:22:00",
    read: true,
    action: { label: "View members", href: "/members" },
  },
];

export function getNotifications(): Notification[] {
  return [...NOTIFICATIONS];
}

export function getNotification(id: string): Notification | undefined {
  return NOTIFICATIONS.find((n) => n.id === id);
}
