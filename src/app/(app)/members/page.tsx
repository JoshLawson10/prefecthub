import { Header } from "@/components/ui/header";
import { Separator } from "@/components/ui/separator";
import { MemberCard } from "@/components/members/member-card";
import { InviteMemberDialog } from "@/components/members/invite-member-dialog";
import { getWorkspaceMembers } from "@/lib/data/users";

export default async function MembersPage() {
  const members = await getWorkspaceMembers();

  return (
    <div>
      <Header title="Members" actions={<InviteMemberDialog />} />
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={{
              id: member.id,
              name: member.full_name,
              avatar: {
                fallback: member.initials,
                imageUrl: member.avatar_url ?? undefined,
              },
              role: { label: member.role },
            }}
          />
        ))}
      </div>
    </div>
  );
}
