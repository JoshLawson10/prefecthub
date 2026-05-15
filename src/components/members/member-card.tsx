import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type MemberRole = "admin" | "prefect" | "staff" | "student";

export type MemberCardData = {
  id: string | number;

  name: string;

  avatar?: {
    imageUrl?: string;
    fallback: string;
  };

  role: {
    label: string;
  };

  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
};

interface MemberCardProps {
  member: MemberCardData;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card>
      <CardHeader>
        <Avatar className="mb-2 h-8 w-8 rounded-lg">
          <AvatarImage src={member.avatar?.imageUrl} />

          <AvatarFallback className="rounded-lg">
            {member.avatar?.fallback}
          </AvatarFallback>
        </Avatar>

        <CardTitle>{member.name}</CardTitle>

        <CardDescription>{member.role.label}</CardDescription>
      </CardHeader>

      {member.badge && (
        <CardContent>
          <Badge variant={member.badge.variant ?? "outline"}>
            {member.badge.label}
          </Badge>
        </CardContent>
      )}
    </Card>
  );
}
