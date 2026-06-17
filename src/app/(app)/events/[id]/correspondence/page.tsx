import { Header } from "@/components/ui/header";
import { CorrespondenceView } from "@/components/correspondence/correspondence-view";
import { LogCorrespondenceDialog } from "@/components/correspondence/log-correspondence-dialog";
import { getEventCorrespondence } from "@/lib/data/correspondence";
import { getWorkspaceMembers } from "@/lib/data/users";

export default async function CorrespondencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [logs, members] = await Promise.all([
    getEventCorrespondence(id),
    getWorkspaceMembers(),
  ]);

  const userMap = Object.fromEntries(members.map((m) => [m.id, m]));

  return (
    <div>
      <Header title="Correspondence" actions={<LogCorrespondenceDialog eventId={id} />} />
      <div className="mt-4">
        <CorrespondenceView logs={logs} userMap={userMap} />
      </div>
    </div>
  );
}
