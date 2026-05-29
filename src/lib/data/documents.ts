import type { Document } from "@/types/database";

export async function getDocument(
  documentId: string,
): Promise<Document | null> {
  return null;
}

export async function getEventDocuments(
  eventId: string,
): Promise<Document[] | null> {
  return null;
}

export async function getDocumentDownloadUrl(
  documentId: string,
): Promise<string | null> {
  return null;
}
