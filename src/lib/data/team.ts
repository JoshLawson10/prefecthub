import type { EventMember } from "@/types";

const TEAM_MEMBERS: EventMember[] = [
  {
    id: "1",
    name: "Josh Lawson",
    initials: "JL",
    workspace_role: "admin",
    event_role: "lead",
    event_id: "1",
  },
  {
    id: "2",
    name: "Sophie Nguyen",
    initials: "SN",
    workspace_role: "admin",
    event_role: "member",
    event_id: "1",
  },
  {
    id: "3",
    name: "Alex Kim",
    initials: "AK",
    workspace_role: "prefect",
    event_role: "member",
    event_id: "1",
  },
  {
    id: "4",
    name: "Mia Thompson",
    initials: "MT",
    workspace_role: "prefect",
    event_role: "member",
    event_id: "1",
  },
  {
    id: "5",
    name: "Ryan Patel",
    initials: "RP",
    workspace_role: "prefect",
    event_role: "member",
    event_id: "1",
  },
  {
    id: "3",
    name: "Alex Kim",
    initials: "AK",
    workspace_role: "prefect",
    event_role: "lead",
    event_id: "2",
  },
  {
    id: "4",
    name: "Mia Thompson",
    initials: "MT",
    workspace_role: "prefect",
    event_role: "member",
    event_id: "2",
  },
];

export function getTeamByEvent(eventId: string): EventMember[] {
  return TEAM_MEMBERS.filter((m) => m.event_id === eventId);
}
