import { createQueryClient } from "@/lib/supabase/query";
import type { Document } from "@/lib/schemas";

const DOC_SELECT = `
  *,
  uploader:users!uploaded_by(full_name, initials)
`;

export async function getDocument(documentId: string): Promise<Document | null> {
    const supabase = createQueryClient();
    const { data, error } = await supabase
      .from("documents")
      .select(DOC_SELECT)
      .eq("id", documentId)
      .single();
    if (error) return null;
    return data;
}

export async function getEventDocuments(eventId: string): Promise<Document[]> {
  const supabase = createQueryClient();
  const { data, error } = await supabase
    .from("documents")
    .select(DOC_SELECT)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching event documents:", error);
    return [];
  }
  return data;
}

export const getDocumentsByEvent = getEventDocuments;

export async function getDocumentDownloadUrl(
  documentId: string,
): Promise<string | null> {
  const supabase = createQueryClient();
  const doc = await getDocument(documentId);
  if (!doc) return null;

  const { data } = await supabase.storage
    .from("documents")
    .createSignedUrl(doc.storage_path, 60 * 60); // 1 hour expiry

  return data?.signedUrl ?? null;
}
