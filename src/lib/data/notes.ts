import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import type { Note } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/data/users";

export const getNote = cache(async (noteId: string): Promise<Note | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*, author:users!author_id(full_name, initials)")
    .eq("id", noteId)
    .single();
  if (error) return null;
  return data;
});

export async function getEventNotes(eventId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*, author:users!author_id(full_name, initials)")
    .eq("event_id", eventId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching event notes:", error);
    return [];
  }
  return data;
}

export const getNotesByEvent = getEventNotes;

export async function getUserNotes(): Promise<Note[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  const { data, error } = await supabase
    .from("notes")
    .select("*, author:users!author_id(full_name, initials)")
    .eq("author_id", currentUser.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user notes:", error);
    return [];
  }
  return data;
}

export async function searchNotes(query: string): Promise<Note[]> {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser?.workspace_id) return [];

  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("notes")
    .select("*, author:users!author_id(full_name, initials)")
    .eq("workspace_id", currentUser.workspace_id)
    .or(`title.ilike.${q},body.ilike.${q}`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error searching notes:", error);
    return [];
  }
  return data;
}
