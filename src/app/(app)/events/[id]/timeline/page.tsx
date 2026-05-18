import { Header } from "@/components/ui/header";
import { TimelineView } from "@/components/timeline/timeline-view";
import { getTimelineByEvent } from "@/lib/data/timeline";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entries = getTimelineByEvent(id);

  return (
    <div>
      <Header title="Timeline" />
      <div className="mt-4">
        <TimelineView entries={entries} />
      </div>
    </div>
  );
}
