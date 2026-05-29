import type {
  SearchResult,
  Event,
  Task,
  Note,
  CorrespondenceLog,
} from "@/lib/schemas";

export async function globalSearch(
  query: string,
): Promise<SearchResult[] | null> {
  return null;
}

export async function searchEvents(query: string): Promise<Event[] | null> {
  return null;
}

export async function searchTasks(query: string): Promise<Task[] | null> {
  return null;
}

export async function searchNotes(query: string): Promise<Note[] | null> {
  return null;
}

export async function searchCorrespondence(
  query: string,
): Promise<CorrespondenceLog[] | null> {
  return null;
}
