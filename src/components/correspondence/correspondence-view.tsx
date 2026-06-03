"use client";

import { useState, useMemo, useEffect } from "react";
import {
  SearchIcon,
  MailIcon,
  UsersIcon,
  PhoneIcon,
  StickyNoteIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import type { CorrespondenceLog, LogType, User } from "@/lib/schemas";
import { getUser } from "@/lib/data/users";
import { formatCorrespondenceDate } from "@/lib/utils/format"; // Import the new function

const LOG_TYPE_CONFIG: Record<
  LogType,
  {
    label: string;
    icon: React.ReactNode;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  email: {
    label: "Email",
    icon: <MailIcon className="size-3.5" />,
    badgeVariant: "default",
  },
  meeting: {
    label: "Meeting",
    icon: <UsersIcon className="size-3.5" />,
    badgeVariant: "secondary",
  },
  phone: {
    label: "Phone",
    icon: <PhoneIcon className="size-3.5" />,
    badgeVariant: "secondary",
  },
  note: {
    label: "Note",
    icon: <StickyNoteIcon className="size-3.5" />,
    badgeVariant: "outline",
  },
};

const TYPE_FILTERS = ["all", "email", "meeting", "phone", "note"] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

interface CorrespondenceViewProps {
  logs: CorrespondenceLog[];
}

export function CorrespondenceView({ logs }: CorrespondenceViewProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [userMap, setUserMap] = useState<Map<string, User>>(new Map());

  // Fetch all unique user data once when logs change
  useEffect(() => {
    const uniqueUserIds = [...new Set(logs.map((log) => log.logged_by))];

    const fetchUsers = async () => {
      const newUserMap = new Map<string, User>();
      for (const userId of uniqueUserIds) {
        const user = await getUser(userId);
        if (user) {
          newUserMap.set(userId, user);
        }
      }
      setUserMap(newUserMap);
    };

    fetchUsers();
  }, [logs]);

  const filtered = useMemo(() => {
    let result = logs;
    if (typeFilter !== "all")
      result = result.filter((l) => l.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.subject.toLowerCase().includes(q) ||
          l.contact_name.toLowerCase().includes(q) ||
          l.logged_by.toLowerCase().includes(q),
      );
    }
    return result;
  }, [logs, typeFilter, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-64">
          <InputGroupInput
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1.5">
          {TYPE_FILTERS.map((f) => (
            <Button
              key={f}
              variant={typeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(f)}
              className="capitalize"
            >
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
                    <p className="text-sm text-muted-foreground">
                      No correspondence logged yet
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((log) => {
                const config = LOG_TYPE_CONFIG[log.type];
                const user = userMap.get(log.logged_by);
                return (
                  <TableRow key={log.id} className="cursor-pointer">
                    <TableCell>
                      <Badge variant={config.badgeVariant} className="gap-1.5">
                        {config.icon}
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="font-medium truncate">{log.subject}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {log.body}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-sm">{log.contact_name}</p>
                      {log.contact_email && (
                        <p className="text-xs text-muted-foreground">
                          {log.contact_email}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Avatar size="sm">
                        <AvatarFallback>{user?.initials ?? "?"}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatCorrespondenceDate(log.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} of {logs.length} entries
        </p>
      )}
    </div>
  );
}
