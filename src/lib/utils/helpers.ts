export function generateInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(
  date: Date,
  format: string = "MMM DD, YYYY",
): string {
  const options: Intl.DateTimeFormatOptions = {};
  if (format.includes("MMM")) options.month = "short";
  if (format.includes("DD")) options.day = "2-digit";
  if (format.includes("YYYY")) options.year = "numeric";
  if (format.includes("HH")) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export function getEventStatusColor(status: string): string {
  const colors = {
    upcoming: "bg-blue-500",
    ongoing: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
  };
  return colors[status as keyof typeof colors] || "bg-gray-500";
}

export function getPriorityColor(priority: string): string {
  const colors = {
    high: "text-red-600 bg-red-100",
    medium: "text-yellow-600 bg-yellow-100",
    low: "text-green-600 bg-green-100",
  };
  return colors[priority as keyof typeof colors] || "text-gray-600 bg-gray-100";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
