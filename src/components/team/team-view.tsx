"use client";

import { ShieldIcon, UserIcon, MoreHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { User, EventRole } from "@/lib/schemas";

type EventMember = User & { event_role: EventRole };

interface TeamViewProps {
  members: EventMember[];
}

export function TeamView({ members }: TeamViewProps) {
  return (
    <Card className="py-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10" />
            <TableHead>Member</TableHead>
            <TableHead className="hidden sm:table-cell w-28">Workspace role</TableHead>
            <TableHead className="w-32">Event role</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No team members assigned yet.
                </p>
              </TableCell>
            </TableRow>
          ) : members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="pl-4">
                <Avatar size="sm">
                  {member.avatar_url && (
                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                  )}
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{member.full_name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Badge
                  variant={
                    ["admin", "captain", "vice-captain"].includes(member.role)
                      ? "default"
                      : "outline"
                  }
                  className="gap-1 capitalize"
                >
                  {["admin", "captain", "vice-captain"].includes(member.role) ? (
                    <ShieldIcon className="size-3" />
                  ) : (
                    <UserIcon className="size-3" />
                  )}
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={member.event_role === "lead" ? "secondary" : "outline"}
                  className="capitalize"
                >
                  {member.event_role === "lead" ? "Event lead" : "Member"}
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
