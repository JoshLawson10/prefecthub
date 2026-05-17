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
import {
  UserPlusIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";

const MEMBERS = [
  {
    id: "1",
    name: "Josh Lawson",
    email: "joshua.lawson13@education.nsw.gov.au",
    role: "admin",
    initials: "JL",
    joined: "1 Feb 2026",
  },
  {
    id: "2",
    name: "Sophie Nguyen",
    email: "sophie.nguyen@education.nsw.gov.au",
    role: "admin",
    initials: "SN",
    joined: "1 Feb 2026",
  },
  {
    id: "3",
    name: "Alex Kim",
    email: "alex.kim@education.nsw.gov.au",
    role: "prefect",
    initials: "AK",
    joined: "3 Feb 2026",
  },
  {
    id: "4",
    name: "Mia Thompson",
    email: "mia.thompson@education.nsw.gov.au",
    role: "prefect",
    initials: "MT",
    joined: "3 Feb 2026",
  },
  {
    id: "5",
    name: "Ryan Patel",
    email: "ryan.patel@education.nsw.gov.au",
    role: "prefect",
    initials: "RP",
    joined: "3 Feb 2026",
  },
  {
    id: "6",
    name: "Emma Chen",
    email: "emma.chen@education.nsw.gov.au",
    role: "prefect",
    initials: "EC",
    joined: "5 Feb 2026",
  },
  {
    id: "7",
    name: "James Wu",
    email: "james.wu@education.nsw.gov.au",
    role: "prefect",
    initials: "JW",
    joined: "5 Feb 2026",
  },
];

const AVATAR_COLOURS = [
  "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  "bg-pink-500/15 text-pink-700 dark:text-pink-400",
  "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  "bg-blue-500/15 text-blue-700 dark:text-blue-400",
];

function MemberAvatar({
  initials,
  index,
}: {
  initials: string;
  index: number;
}) {
  return (
    <div
      className={`size-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${AVATAR_COLOURS[index % AVATAR_COLOURS.length]}`}
    >
      {initials}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  return role === "admin" ? (
    <Badge variant="secondary" className="gap-1 text-xs">
      <ShieldIcon className="size-3" />
      Admin
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 text-xs">
      <UserIcon className="size-3" />
      Prefect
    </Badge>
  );
}

export default function TeamsPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleInvite() {
    if (!inviteEmail) return;
    setSent(true);
    setInviteEmail("");
    setTimeout(() => setSent(false), 3000);
  }

  const admins = MEMBERS.filter((m) => m.role === "admin");
  const prefects = MEMBERS.filter((m) => m.role === "prefect");

  return (
    <div className="flex flex-col gap-6">
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
            />
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              <UserPlusIcon />
              {sent ? "Sent!" : "Invite"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team members</CardTitle>
              <CardDescription className="mt-1">
                {MEMBERS.length} members · {admins.length} admins ·{" "}
                {prefects.length} prefects
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-0 py-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-2.5">
              Admins
            </p>
            {admins.map((member, i) => (
              <div key={member.id}>
                <Separator className="mx-4" />
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MemberAvatar initials={member.initials} index={i} />
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleBadge role={member.role} />
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Options</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-4 py-2.5 border-t border-border mt-1">
              Prefects
            </p>
            {prefects.map((member, i) => (
              <div key={member.id}>
                <Separator className="mx-4" />
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <MemberAvatar
                      initials={member.initials}
                      index={i + admins.length}
                    />
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleBadge role={member.role} />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                          <span className="sr-only">
                            Options for {member.name}
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Manage {member.name}</DialogTitle>
                          <DialogDescription>
                            Change this member&apos;s role or remove them from
                            the workspace.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-2 py-2">
                          <Button
                            variant="outline"
                            className="justify-start gap-2"
                          >
                            <ShieldIcon className="size-4" />
                            Promote to Admin
                          </Button>
                          <Button
                            variant="destructive"
                            className="justify-start gap-2"
                          >
                            Remove from workspace
                          </Button>
                        </div>
                        <DialogFooter showCloseButton />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
              <p>Cumberland HS Prefects 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Created
              </p>
              <p>1 February 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Members
              </p>
              <p>{MEMBERS.length} total</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest mb-1">
                Your role
              </p>
              <p>Admin</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
