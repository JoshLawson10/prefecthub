import type { Document } from "@/types/database";

export async function uploadDocument(
  eventId: string,
  file: File,
  name?: string,
): Promise<Document | null> {
  return null;
}

export async function deleteDocument(documentId: string): Promise<null> {
  return null;
}

export async function updateDocumentName(
  documentId: string,
  name: string,
): Promise<Document | null> {
  return null;
}

export async function batchUploadDocuments(
  eventId: string,
  files: File[],
): Promise<Document[] | null> {
  return null;
}

export async function downloadDocument(documentId: string): Promise<null> {
  return null;
}

export async function moveDocument(
  documentId: string,
  newEventId: string,
): Promise<Document | null> {
  return null;
}
