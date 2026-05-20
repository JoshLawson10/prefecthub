"use server";

import type { EventStatus } from "@/types";

export interface CreateEventInput {
  title: string;
  description: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  collectRsvps: boolean;
  maxCapacity: number | null;
}

export async function createEvent(input: CreateEventInput): Promise<void> {
  console.log("[action] createEvent", input);
  // TODO: insert into events table
}

export async function restoreEvent(eventId: string): Promise<void> {
  console.log("[action] restoreEvent", { eventId });
  // TODO: update events.status = 'upcoming' where id = eventId
}

export async function archiveEvent(eventId: string): Promise<void> {
  console.log("[action] archiveEvent", { eventId });
  // TODO: update events.status = 'completed' where id = eventId
}

export async function updateEventStatus(
  eventId: string,
  status: EventStatus,
): Promise<void> {
  console.log("[action] updateEventStatus", { eventId, status });
  // TODO: update events.status where id = eventId
}
