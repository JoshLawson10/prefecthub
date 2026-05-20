"use server";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export interface UploadDocumentInput {
  eventId: string;
  file: File;
}

export async function uploadDocument(input: UploadDocumentInput): Promise<void> {
  if (input.file.size > MAX_BYTES) {
    throw new Error(`${input.file.name} exceeds the 10 MB limit.`);
  }
  console.log("[action] uploadDocument", {
    eventId: input.eventId,
    name: input.file.name,
    size: input.file.size,
    type: input.file.type,
  });
  // TODO: upload to Supabase Storage, then insert into documents table
}

export async function deleteDocument(documentId: string): Promise<void> {
  console.log("[action] deleteDocument", { documentId });
  // TODO: delete from Supabase Storage, then delete from documents table
}
