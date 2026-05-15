import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { MemberCard, MemberCardData } from "@/components/members/member-card";

const members: MemberCardData[] = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: {
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      fallback: "AJ",
    },
    role: {
      label: "Prefect",
    },
    badge: {
      label: "You",
      variant: "default",
    },
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: {
      imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
      fallback: "BS",
    },
    role: {
      label: "Admin",
    },
  },
  {
    id: 3,
    name: "Charlie Davis",
    avatar: {
      imageUrl: "https://randomuser.me/api/portraits/men/65.jpg",
      fallback: "CD",
    },
    role: {
      label: "Staff",
    },
  },
  {
    id: 4,
    name: "Diana Evans",
    avatar: {
      imageUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      fallback: "DE",
    },
    role: {
      label: "Student",
    },
  },
];

export default async function MembersPage() {
  return (
    <div>
      <Header
        title="Members"
        actions={
          <>
            <Button>
              <UserPlusIcon /> Invite member
            </Button>
          </>
        }
      />
      <Separator className="my-4" />
      <div className="mt-8 grid grid-cols-4 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
