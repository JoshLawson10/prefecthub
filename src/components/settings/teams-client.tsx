"use client";

import { useState } from "react";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlusIcon, MoreHorizontalIcon, ShieldIcon, UserIcon } from "lucide-react";
import { inviteMember, updateMemberRole, removeMember } from "@/lib/actions/members";
import type { User, Workspace } from "@/lib/schemas";

const ROLE_CONFIG: Record<string, {
  label: string;
  icon: React.ReactNode;
  badgeVariant: "secondary" | "outline";
}> = {
  admin:          { label: "Admin",        icon: <ShieldIcon className="size-3" />, badgeVariant: "secondary" },
  captain:        { label: "Captain",      icon: <ShieldIcon className="size-3" />, badgeVariant: "secondary" },
  "vice-captain": { label: "Vice Captain", icon: <ShieldIcon className="size-3" />, badgeVariant: "secondary" },
  prefect:        { label: "Prefect",      icon: <UserIcon   className="size-3" />, badgeVariant: "outline"   },
  member:         { label: "Member",       icon: <UserIcon   className="size-3" />, badgeVariant: "outline"   },
};

function getRoleConfig(role: string) {
  return ROLE_CONFIG[role] ?? {
    label: role,
    icon: <UserIcon className="size-3" />,
    badgeVariant: "outline" as const,
  };
}

function RoleBadge({ role }: { role: string }) {
  const config = getRoleConfig(role);
  return (
    <Badge variant={config.badgeVariant} className="gap-1 text-xs capitalize">
      {config.icon}{config.label}
    </Badge>
  );
}

function ManageDialog({ member }: { member: User }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRoleChange() {
    setLoading(true);
    const newRole = member.role === "admin" ? "prefect" : "admin";
    await updateMemberRole({ memberId: member.id, newRole });
    setLoading(false);
    setOpen(false);
  }

  async function handleRemove() {
    if (!confirm(`Remove ${member.full_name} from the workspace?`)) return;
    setLoading(true);
    await removeMember(member.id);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Change this member&apos;s role or remove them from the workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Button variant="outline" className="justify-start gap-2" disabled={loading} onClick={handleRoleChange}>
            <ShieldIcon className="size-4" />
            {member.role === "admin" ? "Demote to Prefect" : "Promote to Admin"}
          </Button>
          <Button variant="destructive" className="justify-start gap-2" disabled={loading} onClick={handleRemove}>
            Remove from workspace
          </Button>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

function MemberRow({ member, isCurrentUser }: { member: User; isCurrentUser: boolean }) {
  return (
    <div>
      <Separator className="mx-4" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.full_name} />}
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {member.full_name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">(you)</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={member.role} />
          {isCurrentUser ? <div className="size-7" /> : <ManageDialog member={member} />}
        </div>
      </div>
    </div>
  );
}

interface TeamsClientProps {
  currentUser: User;
  members: User[];
  membersByRole: Record<string, User[]>;
  workspace: Workspace | null;
}

export function TeamsClient({ currentUser, members, membersByRole, workspace }: TeamsClientProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [sent,        setSent]        = useState(false);
  const [loading,     setLoading]     = useState(false);

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setLoading(true);
    await inviteMember(inviteEmail.trim());
    setLoading(false);
    setSent(true);
    setInviteEmail("");
    setTimeout(() => setSent(false), 3000);
  }

  const sections = Object.keys(membersByRole);
  const summaryParts = sections.map((role) => {
    const count = membersByRole[role].length;
    const label = getRoleConfig(role).label.toLowerCase();
    return `${count} ${label}${count !== 1 ? "s" : ""}`;
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite a member</CardTitle>
          <CardDescription>
            Send an invitation link to a new prefect. They&apos;ll be added as a
            Member by default — promote to Admin once they&apos;ve joined.
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
            <Button onClick={handleInvite} disabled={!inviteEmail.trim() || loading}>
              <UserPlusIcon />
              {sent ? "Sent!" : loading ? "Sending…" : "Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription className="mt-1">
            {members.length} members · {summaryParts.join(" · ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {sections.map((role, i) => (
            <div key={role}>
              <p className={`text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-2.5 ${i > 0 ? "border-t border-border mt-1" : ""}`}>
                {getRoleConfig(role).label}s
              </p>
              {membersByRole[role].map((member) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isCurrentUser={member.id === currentUser.id}
                />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      {workspace && (
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Details about this Prefect Hub workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">Workspace name</p>
                <p>{workspace.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">School</p>
                <p>{workspace.school}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">Members</p>
                <p>{members.length} total</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">Your role</p>
                <p className="capitalize">{currentUser.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
