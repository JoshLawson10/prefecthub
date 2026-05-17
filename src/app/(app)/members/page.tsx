import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { MemberCard, MemberCardData } from "@/components/members/member-card";
import { InviteMemberDialog } from "@/components/members/invite-member-dialog";

const members: MemberCardData[] = [
  {
    id: 1,
    name: "Josh Lawson",
    avatar: { fallback: "JL" },
    role: { label: "Admin" },
    badge: { label: "You", variant: "default" },
  },
  {
    id: 2,
    name: "Sophie Nguyen",
    avatar: { fallback: "SN" },
    role: { label: "Admin" },
  },
  {
    id: 3,
    name: "Alex Kim",
    avatar: { fallback: "AK" },
    role: { label: "Prefect" },
  },
  {
    id: 4,
    name: "Mia Thompson",
    avatar: { fallback: "MT" },
    role: { label: "Prefect" },
  },
  {
    id: 5,
    name: "Ryan Patel",
    avatar: { fallback: "RP" },
    role: { label: "Prefect" },
  },
  {
    id: 6,
    name: "Emma Chen",
    avatar: { fallback: "EC" },
    role: { label: "Prefect" },
  },
  {
    id: 7,
    name: "James Wu",
    avatar: { fallback: "JW" },
    role: { label: "Prefect" },
  },
];

export default async function MembersPage() {
  return (
    <div>
      <Header
        title="Members"
        actions={<InviteMemberDialog />}
      />
      <Separator className="my-4" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
