"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/data/users";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadDocumentInput {
  eventId: string;
  file: File;
}

export async function uploadDocument(
  input: UploadDocumentInput,
): Promise<void> {
  if (input.file.size > MAX_BYTES) {
    throw new Error(`${input.file.name} exceeds the 10 MB limit.`);
  }

  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Not authenticated");

  // Sanitise filename: strip path separators and limit to safe characters
  const safeName = input.file.name
    .replace(/[/\\]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 200);
  const storagePath = `${input.eventId}/${Date.now()}-${safeName}`;
  const buffer = await input.file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: input.file.type,
      upsert: false,
    });
  if (uploadError) throw new Error(uploadError.message);

  const { error: dbError } = await supabase.from("documents").insert({
    event_id: input.eventId,
    name: input.file.name,
    storage_path: storagePath,
    mime_type: input.file.type,
    size_bytes: input.file.size,
    uploaded_by: currentUser.id,
    workspace_id: currentUser.workspace_id,
  });

  if (dbError) {
    await supabase.storage.from("documents").remove([storagePath]);
    throw new Error(dbError.message);
  }
}

export async function deleteDocument(documentId: string): Promise<void> {
  const supabase = await createClient();

  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .single();

  if (fetchError || !doc) throw new Error("Document not found");

  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([doc.storage_path]);
  if (storageError) throw new Error(storageError.message);

  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);
  if (dbError) throw new Error(dbError.message);
}
