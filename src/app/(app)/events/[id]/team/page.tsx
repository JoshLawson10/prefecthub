import { Header } from "@/components/ui/header";
import { TeamView } from "@/components/team/team-view";
import { AssignMemberDialog } from "@/components/team/assign-member-dialogue";
import { getEventMembers } from "@/lib/data/eventMembers";
import { getWorkspaceMembers } from "@/lib/data/users";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [members, workspaceMembers] = await Promise.all([
    getEventMembers(id),
    getWorkspaceMembers(),
  ]);

  return (
    <div>
      <Header
        title="Team"
        actions={
          <AssignMemberDialog eventId={id} workspaceMembers={workspaceMembers} />
        }
      />
      <div className="mt-4">
        <TeamView members={members} />
      </div>
    </div>
  );
}
