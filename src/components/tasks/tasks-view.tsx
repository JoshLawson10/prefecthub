"use client";

import { useState, useMemo, useCallback } from "react";
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
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { updateTaskStatus } from "@/lib/actions/tasks";
import type { Task, TaskStatus, TaskPriority } from "@/lib/schemas";
import { formatShortDate } from "@/lib/utils/format";

const PAGE_SIZE = 10;

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

// Safely extract joined relation fields — Supabase joins land as nested objects
function assigneeName(task: Task): string | null {
  return (task as any).assigned_user?.full_name ?? null;
}
function assigneeInitials(task: Task): string | null {
  return (task as any).assigned_user?.initials ?? null;
}
function eventTitle(task: Task): string {
  return (task as any).event?.title ?? task.event_id;
}

interface TasksViewProps {
  tasks: Task[];
  scopedToEvent?: boolean;
}

export function TasksView({
  tasks: initialTasks,
  scopedToEvent = false,
}: TasksViewProps) {
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, TaskStatus>
  >({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [page, setPage] = useState(1);

  const tasks = useMemo(
    () =>
      initialTasks.map((t) => ({
        ...t,
        status: (statusOverrides[t.id] ?? t.status) as TaskStatus,
      })),
    [initialTasks, statusOverrides],
  );

  const toggleDone = useCallback(
    async (task: Task) => {
      const current = (statusOverrides[task.id] ?? task.status) as TaskStatus;
      const next: TaskStatus =
        current === "done"
          ? ((initialTasks.find((t) => t.id === task.id)?.status ??
              "todo") as TaskStatus)
          : "done";
      setStatusOverrides((prev) => ({ ...prev, [task.id]: next }));
      await updateTaskStatus({ taskId: task.id, status: next });
    },
    [initialTasks, statusOverrides],
  );

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
          eventTitle(t).toLowerCase().includes(q) ||
          (assigneeName(t) ?? "").toLowerCase().includes(q),
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
      return (a.due_date ?? "").localeCompare(b.due_date ?? "");
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleFilterChange(fn: () => void) {
    fn();
    setPage(1);
  }

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
            onChange={(e) =>
              handleFilterChange(() => setSearch(e.target.value))
            }
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
              onClick={() => handleFilterChange(() => setStatusFilter(f.value))}
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
              onClick={() =>
                handleFilterChange(() => setPriorityFilter(f.value))
              }
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
              <TableHead className="w-10 pl-4">Done</TableHead>
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
            {paginated.length === 0 ? (
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
                        setPage(1);
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((task) => {
                const isDone = task.status === "done";
                const status = STATUS_CONFIG[task.status];
                const priority = PRIORITY_CONFIG[task.priority];

                return (
                  <TableRow
                    key={task.id}
                    className={cn(
                      "group transition-colors",
                      isDone && "opacity-60",
                    )}
                  >
                    <TableCell className="pl-4">
                      <button
                        type="button"
                        onClick={() => toggleDone(task)}
                        aria-label={
                          isDone ? "Mark incomplete" : "Mark complete"
                        }
                        className={cn(
                          "flex items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          isDone
                            ? "text-emerald-500 dark:text-emerald-400 hover:text-muted-foreground"
                            : cn(
                                "hover:text-emerald-500 dark:hover:text-emerald-400",
                                status.iconClass,
                              ),
                        )}
                      >
                        {isDone ? (
                          <CircleCheckIcon className="size-4" />
                        ) : (
                          <span className="flex opacity-60 group-hover:opacity-100 transition-opacity">
                            {status.icon}
                          </span>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p
                        className={cn(
                          "font-medium truncate",
                          isDone && "line-through text-muted-foreground",
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
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors truncate max-w-36 block"
                        >
                          {eventTitle(task)}
                        </Link>
                      </TableCell>
                    )}
                    <TableCell>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {assigneeInitials(task) ?? "?"}
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
                        {task.due_date ? formatShortDate(task.due_date) : "—"}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">
              {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} tasks
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === safePage ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {filtered.length > 0 && totalPages === 1 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} of {tasks.length} tasks
        </p>
      )}
    </div>
  );
}
