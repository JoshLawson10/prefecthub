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
import type { EventMember } from "@/types";

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
            <TableHead className="hidden sm:table-cell w-28">
              Workspace role
            </TableHead>
            <TableHead className="w-32">Event role</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, i) => (
            <TableRow key={`${member.id}-${i}`}>
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
                  variant={
                    member.workspace_role === "admin" ? "default" : "outline"
                  }
                  className="gap-1"
                >
                  {member.workspace_role === "admin" ? (
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
                    member.event_role === "lead" ? "secondary" : "outline"
                  }
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
