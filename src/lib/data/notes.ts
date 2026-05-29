import type { Note } from "@/types/database";

export async function getNote(noteId: string): Promise<Note | null> {
  return null;
}

export async function getEventNotes(eventId: string): Promise<Note[] | null> {
  return null;
}

export async function getUserNotes(): Promise<Note[] | null> {
  return null;
}

export async function searchNotes(query: string): Promise<Note[] | null> {
  return null;
}
