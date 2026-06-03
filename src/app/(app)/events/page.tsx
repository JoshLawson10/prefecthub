import { getWorkspaceEvents } from "@/lib/data/events";
import { EventsClient } from "@/components/events/events-client";

export default async function EventsPage() {
  const events = await getWorkspaceEvents();
  return <EventsClient events={events} />;
}
