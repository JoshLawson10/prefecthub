import type { Pagination, Filters } from "@/lib/schemas";

export function withPagination<
  T extends { range: (start: number, end: number) => T },
>(query: T, pagination?: Pagination): T {
  if (!pagination) return query;

  const { limit = 10, offset = 0 } = pagination;
  const start = offset;
  const end = offset + limit - 1;

  return query.range(start, end);
}

export function withFilters<
  T extends {
    eq: (column: string, value: unknown) => T;
    gte: (column: string, value: unknown) => T;
    lte: (column: string, value: unknown) => T;
    in: (column: string, values: unknown[]) => T;
  },
>(query: T, filters?: Filters): T {
  if (!filters) return query;

  let filteredQuery = query;

  if (filters.status && filters.status.length > 0) {
    filteredQuery = filteredQuery.in("status", filters.status);
  }

  if (filters.dateRange) {
    if (filters.dateRange.start) {
      const start =
        filters.dateRange.start instanceof Date
          ? filters.dateRange.start.toISOString()
          : filters.dateRange.start;
      filteredQuery = filteredQuery.gte("date_start", start);
    }
    if (filters.dateRange.end) {
      const end =
        filters.dateRange.end instanceof Date
          ? filters.dateRange.end.toISOString()
          : filters.dateRange.end;
      filteredQuery = filteredQuery.lte("date_end", end);
    }
  }

  if (filters.assignedTo) {
    filteredQuery = filteredQuery.eq("assigned_to", filters.assignedTo);
  }

  if (filters.priority && filters.priority.length > 0) {
    filteredQuery = filteredQuery.in("priority", filters.priority);
  }

  return filteredQuery;
}

export function handleDatabaseError(error: unknown): never {
  console.error("Database error:", error);

  if (error instanceof Error) {
    throw new Error(`Database operation failed: ${error.message}`);
  }

  throw new Error("Database operation failed: Unknown error");
}
