"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";

export interface CreateNoteInput {
  eventId: string;
  title: string;
  body: string;
}

export async function createNote(input: CreateNoteInput): Promise<void> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  const { error } = await supabase.from("notes").insert({
    event_id: input.eventId,
    title: input.title,
    body: input.body,
    author_id: currentUser.id,
    workspace_id: currentUser.workspace_id,
  });
  if (error) throw new Error(error.message);
}

export async function updateNote(
  id: string,
  title: string,
  body: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("notes")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
