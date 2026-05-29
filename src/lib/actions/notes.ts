import type { Note } from "@/lib/schemas";

export async function createNote(
  data: Omit<Note, "id" | "created_at" | "updated_at">,
): Promise<Note | null> {
  return null;
}

export async function updateNote(
  noteId: string,
  data: Partial<Note>,
): Promise<Note | null> {
  return null;
}

export async function deleteNote(noteId: string): Promise<null> {
  return null;
}

export async function pinNote(noteId: string): Promise<null> {
  return null;
}
