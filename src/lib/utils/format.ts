import { format } from "date-fns";

export function formatEventDate(event: {
  date_start: string | Date;
  date_end: string | Date;
}): string {
  const start = new Date(event.date_start);
  const end = new Date(event.date_end);

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${format(start, "MMM d, yyyy")}`;
  }

  return `${format(start, "MMM d, h:mm a")} - ${format(end, "MMM d, h:mm a")}`;
}

export function formatEventTime(event: {
  date_start: string | Date;
  date_end: string | Date;
}): string {
  const start = new Date(event.date_start);
  const end = new Date(event.date_end);

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  }

  return `${format(start, "MMM d, h:mm a")} - ${format(end, "MMM d, h:mm a")}`;
}

export function formatShortDate(date: string | Date): string {
  return format(new Date(date), "MMM d");
}

export function formatLongDate(date: string | Date): string {
  return format(new Date(date), "EEEE, MMMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), "h:mm a");
}

export function formatCorrespondenceDate(date: string | Date): string {
  return format(new Date(date), "d MMM yyyy");
}

export function formatRelativeDays(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffDays = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)} days ago`;

  return format(target, "MMM d, yyyy");
}

export function formatInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
