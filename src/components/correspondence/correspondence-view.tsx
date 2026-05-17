"use client";

import { useState, useMemo } from "react";
import { SearchIcon, MailIcon, UsersIcon, PhoneIcon, StickyNoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";

type LogType = "email" | "meeting" | "phone" | "note";

interface CorrespondenceLog {
  id: string;
  type: LogType;
  subject: string;
  body: string;
  contactName: string;
  contactEmail?: string;
  loggedBy: string;
  loggedByInitials: string;
  date: string;
  eventId: string;
}

const ALL_LOGS: CorrespondenceLog[] = [
  { id: "l1", type: "email",   subject: "PAT catering budget approval",         body: "Requested $650 from P&C for catering at the Prefect Afternoon Tea.",  contactName: "Ms Carter",    contactEmail: "carter@cumberland.edu.au",  loggedBy: "Josh Lawson",   loggedByInitials: "JL", date: "12 May", eventId: "1" },
  { id: "l2", type: "phone",   subject: "Hall B booking confirmed",              body: "Called to reserve Hall B for 30 May, 3–5 PM. Confirmed by admin.",     contactName: "Mrs Patel",    contactEmail: "patel@cumberland.edu.au",   loggedBy: "Josh Lawson",   loggedByInitials: "JL", date: "8 May",  eventId: "1" },
  { id: "l3", type: "meeting", subject: "PAT planning — prefect body",           body: "Discussed catering, decorations, run sheet, and RSVP targets.",        contactName: "All prefects",                                               loggedBy: "Sophie Nguyen", loggedByInitials: "SN", date: "5 May",  eventId: "1" },
  { id: "l4", type: "note",    subject: "Catering vendor shortlist",             body: "Three vendors researched — local bakery, supermarket, school canteen.", contactName: "Internal note",                                              loggedBy: "Josh Lawson",   loggedByInitials: "JL", date: "3 May",  eventId: "1" },
  { id: "l5", type: "email",   subject: "Yr 7 orientation — teacher volunteers", body: "Asked Mr Nguyen to coordinate teacher supervisors for the day.",        contactName: "Mr Nguyen",    contactEmail: "nguyen@cumberland.edu.au",  loggedBy: "Alex Kim",      loggedByInitials: "AK", date: "5 May",  eventId: "3" },
  { id: "l6", type: "meeting", subject: "Assembly AV requirements",              body: "Need microphone, projector, and clicker for 26 May assembly.",         contactName: "AV team",                                                    loggedBy: "Mia Thompson",  loggedByInitials: "MT", date: "4 May",  eventId: "2" },
];

const LOG_TYPE_CONFIG: Record<LogType, {
  label: string;
  icon: React.ReactNode;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}> = {
  email:   { label: "Email",   icon: <MailIcon        className="size-3.5" />, badgeVariant: "default"   },
  meeting: { label: "Meeting", icon: <UsersIcon       className="size-3.5" />, badgeVariant: "secondary" },
  phone:   { label: "Phone",   icon: <PhoneIcon       className="size-3.5" />, badgeVariant: "secondary" },
  note:    { label: "Note",    icon: <StickyNoteIcon  className="size-3.5" />, badgeVariant: "outline"   },
};

const TYPE_FILTERS = ["all", "email", "meeting", "phone", "note"] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

interface CorrespondenceViewProps {
  eventId?: string;
}

export function CorrespondenceView({ eventId }: CorrespondenceViewProps) {
  const [search,     setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const baseLogs = useMemo(
    () => eventId ? ALL_LOGS.filter((l) => l.eventId === eventId) : ALL_LOGS,
    [eventId],
  );

  const filtered = useMemo(() => {
    let logs = baseLogs;
    if (typeFilter !== "all") logs = logs.filter((l) => l.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      logs = logs.filter((l) =>
        l.subject.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.loggedBy.toLowerCase().includes(q),
      );
    }
    return logs;
  }, [baseLogs, typeFilter, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-64">
          <InputGroupInput placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <InputGroupAddon align="inline-end"><SearchIcon /></InputGroupAddon>
        </InputGroup>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <Button key={f} variant={typeFilter === f ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(f)} className="capitalize">
              {f === "all" ? "All types" : f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead className="w-10">By</TableHead>
              <TableHead className="w-24 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <MailIcon className="size-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No correspondence logged yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.map((log) => {
              const config = LOG_TYPE_CONFIG[log.type];
              return (
                <TableRow key={log.id} className="cursor-pointer">
                  <TableCell>
                    <Badge variant={config.badgeVariant} className="gap-1.5">
                      {config.icon}{config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="font-medium truncate">{log.subject}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{log.body}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <p className="text-sm">{log.contactName}</p>
                    {log.contactEmail && <p className="text-xs text-muted-foreground">{log.contactEmail}</p>}
                  </TableCell>
                  <TableCell>
                    <Avatar size="sm"><AvatarFallback>{log.loggedByInitials}</AvatarFallback></Avatar>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs text-muted-foreground tabular-nums">{log.date}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} of {baseLogs.length} entries
        </p>
      )}
    </div>
  );
}
