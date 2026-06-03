import { getArchivedEvents } from "@/lib/data/events";
import { ArchiveClient } from "@/components/events/archive-client";

export default async function ArchivePage() {
  const events = await getArchivedEvents();
  return <ArchiveClient events={events} />;
}
