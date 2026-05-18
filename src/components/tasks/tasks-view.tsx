"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CircleIcon,
  LoaderIcon,
  CircleCheckIcon,
  CircleAlertIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowRightIcon,
  ArrowDownIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { Task, TaskStatus, TaskPriority } from "@/types";

const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    icon: React.ReactNode;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    iconClass: string;
  }
> = {
  overdue: {
    label: "Overdue",
    icon: <CircleAlertIcon className="size-3.5" />,
    badgeVariant: "destructive",
    iconClass: "text-destructive",
  },
  in_progress: {
    label: "In progress",
    icon: <LoaderIcon className="size-3.5" />,
    badgeVariant: "default",
    iconClass: "text-primary",
  },
  todo: {
    label: "To do",
    icon: <CircleIcon className="size-3.5" />,
    badgeVariant: "secondary",
    iconClass: "text-muted-foreground",
  },
  done: {
    label: "Done",
    icon: <CircleCheckIcon className="size-3.5" />,
    badgeVariant: "outline",
    iconClass: "text-muted-foreground",
  },
};

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; icon: React.ReactNode; className: string }
> = {
  high: {
    label: "High",
    icon: <ArrowUpIcon className="size-3.5" />,
    className: "text-destructive",
  },
  medium: {
    label: "Medium",
    icon: <ArrowRightIcon className="size-3.5" />,
    className: "text-amber-500 dark:text-amber-400",
  },
  low: {
    label: "Low",
    icon: <ArrowDownIcon className="size-3.5" />,
    className: "text-muted-foreground",
  },
};

const STATUS_SORT: Record<TaskStatus, number> = {
  overdue: 0,
  in_progress: 1,
  todo: 2,
  done: 3,
};
const PRIORITY_SORT: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

type StatusFilter = TaskStatus | "all";
type PriorityFilter = TaskPriority | "all";

interface TasksViewProps {
  tasks: Task[];
  scopedToEvent?: boolean;
}

export function TasksView({ tasks, scopedToEvent = false }: TasksViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");

  const counts = useMemo(
    () => ({
      overdue: tasks.filter((t) => t.status === "overdue").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      todo: tasks.filter((t) => t.status === "todo").length,
      done: tasks.filter((t) => t.status === "done").length,
    }),
    [tasks],
  );

  const filtered = useMemo(() => {
    let result = tasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.event_title.toLowerCase().includes(q) ||
          (t.assignee_name ?? "").toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all")
      result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter !== "all")
      result = result.filter((t) => t.priority === priorityFilter);
    return [...result].sort((a, b) => {
      const s = STATUS_SORT[a.status] - STATUS_SORT[b.status];
      if (s !== 0) return s;
      const p = PRIORITY_SORT[a.priority] - PRIORITY_SORT[b.priority];
      if (p !== 0) return p;
      return (a.due_date_sort ?? "").localeCompare(b.due_date_sort ?? "");
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const STATUS_FILTERS: {
    value: StatusFilter;
    label: string;
    count?: number;
  }[] = [
    { value: "all", label: "All" },
    { value: "overdue", label: "Overdue", count: counts.overdue },
    { value: "in_progress", label: "In progress", count: counts.in_progress },
    { value: "todo", label: "To do", count: counts.todo },
    { value: "done", label: "Done", count: counts.done },
  ];

  const PRIORITY_FILTERS: { value: PriorityFilter; label: string }[] = [
    { value: "all", label: "All priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="w-64">
          <InputGroupInput
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(f.value)}
              className="gap-1.5"
            >
              {f.label}
              {f.count !== undefined && f.count > 0 && (
                <span
                  className={cn(
                    "inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold",
                    statusFilter === f.value
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : f.value === "overdue"
                        ? "bg-destructive/15 text-destructive"
                        : "bg-muted-foreground/15 text-muted-foreground",
                  )}
                >
                  {f.count}
                </span>
              )}
            </Button>
          ))}
        </div>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-1.5">
          {PRIORITY_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={priorityFilter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setPriorityFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {(
          [
            {
              label: "Overdue",
              value: counts.overdue,
              className: "text-destructive",
            },
            {
              label: "In progress",
              value: counts.in_progress,
              className: "text-primary",
            },
            {
              label: "To do",
              value: counts.todo,
              className: "text-foreground",
            },
            {
              label: "Done",
              value: counts.done,
              className: "text-muted-foreground",
            },
          ] as const
        ).map((s) => (
          <Card key={s.label} size="sm">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p
                className={cn(
                  "text-2xl font-semibold tabular-nums mt-0.5",
                  s.className,
                )}
              >
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="py-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Task</TableHead>
              {!scopedToEvent && (
                <TableHead className="hidden sm:table-cell">Event</TableHead>
              )}
              <TableHead className="w-10">Assignee</TableHead>
              <TableHead className="hidden md:table-cell w-28">
                Priority
              </TableHead>
              <TableHead className="w-20 text-right">Due</TableHead>
              <TableHead className="hidden lg:table-cell w-28">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={scopedToEvent ? 6 : 7}>
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <CircleCheckIcon className="size-8 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      No tasks match your filters
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((task) => {
                const status = STATUS_CONFIG[task.status];
                const priority = PRIORITY_CONFIG[task.priority];
                return (
                  <TableRow key={task.id} className="cursor-pointer">
                    <TableCell className="pl-4">
                      <span className={cn("flex", status.iconClass)}>
                        {status.icon}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p
                        className={cn(
                          "font-medium truncate",
                          task.status === "done" &&
                            "line-through text-muted-foreground",
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </TableCell>
                    {!scopedToEvent && (
                      <TableCell className="hidden sm:table-cell">
                        <Link
                          href={`/events/${task.event_id}/tasks`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-36 block"
                        >
                          {task.event_title}
                        </Link>
                      </TableCell>
                    )}
                    <TableCell>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {task.assignee_initials ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-medium",
                          priority.className,
                        )}
                      >
                        {priority.icon}
                        {priority.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          task.status === "overdue"
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        {task.due_date}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant={status.badgeVariant}>
                        {status.label}
                      </Badge>
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
          Showing {filtered.length} of {tasks.length} tasks
        </p>
      )}
    </div>
  );
}
