"use client";

import { ShieldIcon, UserIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EventRole = "lead" | "member";

interface EventMember {
  id: string;
  name: string;
  initials: string;
  role: "Admin" | "Prefect";
  eventRole: EventRole;
  eventId: string;
}

const ALL_MEMBERS: EventMember[] = [
  {
    id: "1",
    name: "Josh Lawson",
    initials: "JL",
    role: "Admin",
    eventRole: "lead",
    eventId: "1",
  },
  {
    id: "2",
    name: "Sophie Nguyen",
    initials: "SN",
    role: "Admin",
    eventRole: "member",
    eventId: "1",
  },
  {
    id: "3",
    name: "Alex Kim",
    initials: "AK",
    role: "Prefect",
    eventRole: "member",
    eventId: "1",
  },
  {
    id: "4",
    name: "Mia Thompson",
    initials: "MT",
    role: "Prefect",
    eventRole: "member",
    eventId: "1",
  },
  {
    id: "5",
    name: "Ryan Patel",
    initials: "RP",
    role: "Prefect",
    eventRole: "member",
    eventId: "1",
  },
  {
    id: "6",
    name: "Alex Kim",
    initials: "AK",
    role: "Prefect",
    eventRole: "lead",
    eventId: "2",
  },
  {
    id: "7",
    name: "Mia Thompson",
    initials: "MT",
    role: "Prefect",
    eventRole: "member",
    eventId: "2",
  },
];

interface TeamViewProps {
  eventId?: string;
}

export function TeamView({ eventId }: TeamViewProps) {
  const members = eventId
    ? ALL_MEMBERS.filter((m) => m.eventId === eventId)
    : ALL_MEMBERS;

  return (
    <Card className="py-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Member</TableHead>
            <TableHead className="hidden sm:table-cell w-28">
              Workspace role
            </TableHead>
            <TableHead className="w-32">Event role</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="pl-4">
                <Avatar size="sm">
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{member.name}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge
                  variant={member.role === "Admin" ? "default" : "outline"}
                  className="gap-1"
                >
                  {member.role === "Admin" ? (
                    <>
                      <ShieldIcon className="size-3" /> Admin
                    </>
                  ) : (
                    <>
                      <UserIcon className="size-3" /> Prefect
                    </>
                  )}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    member.eventRole === "lead" ? "secondary" : "outline"
                  }
                  className="capitalize"
                >
                  {member.eventRole === "lead" ? "Event lead" : "Member"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
