"use client";

import { useRef } from "react";
import {
  FileTextIcon, FileSpreadsheetIcon, FileImageIcon,
  FileIcon, DownloadIcon, TrashIcon, UploadIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { uploadDocument, deleteDocument } from "@/lib/actions";
import type { EventDocument } from "@/types";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  const base = cn("size-4 shrink-0", className);
  if (mimeType.includes("pdf"))                            return <FileTextIcon        className={cn(base, "text-rose-500")}           />;
  if (mimeType.includes("xlsx") || mimeType.includes("sheet")) return <FileSpreadsheetIcon className={cn(base, "text-emerald-500")}        />;
  if (mimeType.includes("image"))                          return <FileImageIcon       className={cn(base, "text-blue-500")}           />;
  return                                                          <FileIcon            className={cn(base, "text-muted-foreground")}   />;
}

interface DocumentsViewProps {
  documents: EventDocument[];
  eventId: string;
}

export function DocumentsView({ documents, eventId }: DocumentsViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        alert(`${file.name} exceeds the 10 MB limit and was skipped.`);
        continue;
      }
      await uploadDocument({ eventId, file });
    }
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    await handleFiles(e.dataTransfer.files);
  }

  async function handleDelete(documentId: string) {
    await deleteDocument(documentId);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-muted/40"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm">
          <UploadIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Drop files here or click to upload</p>
          <p className="mt-0.5 text-xs text-muted-foreground">PDF, Word, Excel, images — max 10 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {documents.length > 0 ? (
        <Card className="py-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>File</TableHead>
                <TableHead className="hidden sm:table-cell w-24">Size</TableHead>
                <TableHead className="w-10">By</TableHead>
                <TableHead className="hidden sm:table-cell w-24 text-right">Uploaded</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="pl-4"><FileTypeIcon mimeType={doc.mime_type} /></TableCell>
                  <TableCell>
                    <p className="text-sm font-medium truncate max-w-xs">{doc.name}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground tabular-nums">{doc.size}</span>
                  </TableCell>
                  <TableCell>
                    <Avatar size="sm"><AvatarFallback>{doc.uploaded_by_initials}</AvatarFallback></Avatar>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <span className="text-xs text-muted-foreground tabular-nums">{doc.date}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Download">
                        <DownloadIcon className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        aria-label="Delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <TrashIcon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">No documents uploaded yet.</p>
      )}
    </div>
  );
}
