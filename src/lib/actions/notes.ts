"use server";

export interface CreateNoteInput {
  eventId: string;
  title: string;
  body: string;
}

export async function createNote(input: CreateNoteInput): Promise<void> {
  console.log("[action] createNote", input);
  // TODO: insert into notes table
}

export async function updateNote(id: string, title: string, body: string): Promise<void> {
  console.log("[action] updateNote", { id, title, body });
  // TODO: update notes where id = id
}

export async function deleteNote(id: string): Promise<void> {
  console.log("[action] deleteNote", { id });
  // TODO: delete from notes where id = id
}
