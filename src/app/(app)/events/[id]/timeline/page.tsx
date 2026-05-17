import { Header } from "@/components/ui/header";
import { TimelineView } from "@/components/timeline/timeline-view";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Header title="Timeline" />
      <div className="mt-4">
        <TimelineView eventId={id} />
      </div>
    </div>
  );
}
