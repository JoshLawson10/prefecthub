import { Header } from "@/components/ui/header";
import { CorrespondenceView } from "@/components/correspondence/correspondence-view";
import { LogCorrespondenceDialog } from "@/components/correspondence/log-correspondence-dialog";

export default async function CorrespondencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Header title="Correspondence" actions={<LogCorrespondenceDialog />} />
      <div className="mt-4">
        <CorrespondenceView eventId={id} />
      </div>
    </div>
  );
}
