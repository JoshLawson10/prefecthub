import { Header } from "@/components/ui/header";
import { TeamView } from "@/components/team/team-view";
import { AssignMemberDialog } from "@/components/team/assign-member-dialogue";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Header title="Team" actions={<AssignMemberDialog />} />
      <div className="mt-4">
        <TeamView eventId={id} />
      </div>
    </div>
  );
}
