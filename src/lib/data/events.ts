import { Event, EventStats, Filters, Pagination } from "@/types/database";

export async function getEvent(eventId: string): Promise<Event | null> {
  return null;
}

export async function getWorkspaceEvents(
  filters?: Filters,
  pagination?: Pagination,
): Promise<Event[]> {
  return null;
}

export async function getUserEvents(filters?: Filters): Promise<Event[]> {
  return null;
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  return null;
}

export async function getEventsByDateRange(
  start: Date,
  end: Date,
): Promise<Event[]> {
  return null;
}

export async function getEventStats(eventId: string): Promise<EventStats> {
  return null;
}
