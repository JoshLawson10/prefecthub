import { Header } from "@/components/ui/header";
import { TeamView } from "@/components/team/team-view";
import { AssignMemberDialog } from "@/components/team/assign-member-dialogue";
import { getTeamByEvent } from "@/lib/data/team";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const members = getTeamByEvent(id);

  return (
    <div>
      <Header title="Team" actions={<AssignMemberDialog eventId={id} />} />
      <div className="mt-4">
        <TeamView members={members} />
      </div>
    </div>
  );
}
