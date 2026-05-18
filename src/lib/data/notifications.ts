import type { Notification } from "@/types";

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "task_overdue",
    title: "Task overdue",
    description:
      "Book catering for PAT — assigned to you · Prefect Afternoon Tea",
    timestamp: "Today",
    read: false,
    event_id: "1",
  },
  {
    id: "n2",
    type: "rsvp",
    title: "New RSVP",
    description:
      "Emily Zhang submitted an RSVP for Prefect Afternoon Tea (2 guests)",
    timestamp: "Today",
    read: false,
    event_id: "1",
  },
  {
    id: "n3",
    type: "task_assigned",
    title: "Task assigned",
    description: "Design RSVP form — assigned by Sophie Nguyen · Due 22 May",
    timestamp: "12 May",
    read: false,
    event_id: "1",
  },
  {
    id: "n4",
    type: "task_completed",
    title: "Task completed",
    description: "Draft P&C funding letter — completed by Josh Lawson",
    timestamp: "11 May",
    read: true,
    event_id: "1",
  },
  {
    id: "n5",
    type: "correspondence",
    title: "Correspondence logged",
    description:
      "Email logged — PAT catering budget approval · Prefect Afternoon Tea",
    timestamp: "12 May",
    read: true,
    event_id: "1",
  },
  {
    id: "n6",
    type: "event_created",
    title: "New event created",
    description:
      "Farewell Ceremony added for Fri 20 Jun · Created by Sophie Nguyen",
    timestamp: "10 May",
    read: true,
  },
  {
    id: "n7",
    type: "task_overdue",
    title: "Task overdue",
    description: "Confirm AV equipment for assembly — assigned to Alex Kim",
    timestamp: "9 May",
    read: true,
    event_id: "2",
  },
  {
    id: "n8",
    type: "member_added",
    title: "Member joined",
    description: "Emma Chen joined the workspace",
    timestamp: "5 Feb",
    read: true,
  },
];

export function getNotifications(): Notification[] {
  return [...NOTIFICATIONS];
}
