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
  // TODO: set events.status = 'upcoming' where id = eventId
}
