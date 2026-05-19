"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  UserPlusIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { getMembers, getMembersByRole } from "@/lib/data/members";
import { getWorkspace } from "@/lib/data/workspace";
import type { Profile } from "@/types";

const ALL_MEMBERS = getMembers();
const MEMBERS_BY_ROLE = getMembersByRole();
const WORKSPACE = getWorkspace();

// TODO: derive from session once auth is wired up
const CURRENT_USER = ALL_MEMBERS.find((m) => m.id === "1")!;

const ROLE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; badgeVariant: "secondary" | "outline" }
> = {
  admin:   { label: "Admin",   icon: <ShieldIcon className="size-3" />, badgeVariant: "secondary" },
  prefect: { label: "Prefect", icon: <UserIcon   className="size-3" />, badgeVariant: "outline"   },
};

function getRoleConfig(role: string) {
  return ROLE_CONFIG[role] ?? { label: role, icon: <UserIcon className="size-3" />, badgeVariant: "outline" as const };
}

function RoleBadge({ role }: { role: Profile["role"] }) {
  const config = getRoleConfig(role);
  return (
    <Badge variant={config.badgeVariant} className="gap-1 text-xs">
      {config.icon}
      {config.label}
    </Badge>
  );
}

function MemberRow({
  member,
  isCurrentUser,
  showManage,
}: {
  member: Profile;
  isCurrentUser: boolean;
  showManage: boolean;
}) {
  return (
    <div>
      <Separator className="mx-4" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {member.full_name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  (you)
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RoleBadge role={member.role} />
          {showManage ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon />
                  <span className="sr-only">Options for {member.full_name}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage {member.full_name}</DialogTitle>
                  <DialogDescription>
                    Change this member&apos;s role or remove them from the
                    workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-2">
                  <Button variant="outline" className="justify-start gap-2">
                    <ShieldIcon className="size-4" />
                    {member.role === "admin" ? "Demote to Prefect" : "Promote to Admin"}
                  </Button>
                  <Button variant="destructive" className="justify-start gap-2">
                    Remove from workspace
                  </Button>
                </div>
                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="size-7" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    setSent(true);
    setInviteEmail("");
    setTimeout(() => setSent(false), 3000);
  }

  const sections = Object.keys(MEMBERS_BY_ROLE);

  const summaryParts = sections.map((role) => {
    const count = MEMBERS_BY_ROLE[role].length;
    const label = getRoleConfig(role).label.toLowerCase();
    return `${count} ${label}${count !== 1 ? "s" : ""}`;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle>Invite a member</CardTitle>
          <CardDescription>
            Send an invitation link to a new prefect. They&apos;ll be added as a
            Prefect by default — promote to Admin once they&apos;ve joined.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-sm">
            <Input
              type="email"
              placeholder="email@education.nsw.gov.au"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Button onClick={handleInvite} disabled={!inviteEmail.trim()}>
              <UserPlusIcon />
              {sent ? "Sent!" : "Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Member list */}
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription className="mt-1">
            {ALL_MEMBERS.length} members · {summaryParts.join(" · ")}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 py-0">
          {sections.map((role, sectionIndex) => (
            <div key={role}>
              <p
                className={`text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-2.5 ${
                  sectionIndex > 0 ? "border-t border-border mt-1" : ""
                }`}
              >
                {getRoleConfig(role).label}s
              </p>
              {MEMBERS_BY_ROLE[role].map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isCurrentUser={member.id === CURRENT_USER.id}
                  showManage={member.id !== CURRENT_USER.id}
                />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Workspace info */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Details about this Prefect Hub workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Workspace name
              </p>
              <p>{WORKSPACE.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Created
              </p>
              <p>{WORKSPACE.created_at}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Members
              </p>
              <p>{ALL_MEMBERS.length} total</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Your role
              </p>
              <p className="capitalize">{CURRENT_USER.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
