"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileTextIcon,
  FileSpreadsheetIcon,
  FileImageIcon,
  FileIcon,
  DownloadIcon,
  TrashIcon,
  UploadIcon,
  LoaderIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { uploadDocument, deleteDocument, getDocumentDownloadUrl } from "@/lib/actions/documents";
import type { Document } from "@/lib/schemas";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FileTypeIcon({
  mimeType,
  className,
}: {
  mimeType: string;
  className?: string;
}) {
  const base = cn("size-4 shrink-0", className);
  if (mimeType.includes("pdf"))
    return <FileTextIcon className={cn(base, "text-rose-500")} />;
  if (mimeType.includes("xlsx") || mimeType.includes("sheet"))
    return <FileSpreadsheetIcon className={cn(base, "text-emerald-500")} />;
  if (mimeType.includes("image"))
    return <FileImageIcon className={cn(base, "text-blue-500")} />;
  return <FileIcon className={cn(base, "text-muted-foreground")} />;
}

interface DocumentsViewProps {
  documents: Document[];
  eventId: string;
}

export function DocumentsView({ documents, eventId }: DocumentsViewProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const fileArray = Array.from(files);
    const oversized = fileArray.filter((f) => f.size > MAX_BYTES);
    if (oversized.length > 0) {
      setError(
        `${oversized.map((f) => f.name).join(", ")} exceed${oversized.length === 1 ? "s" : ""} the 10 MB limit.`,
      );
    }

    const valid = fileArray.filter((f) => f.size <= MAX_BYTES);
    if (valid.length === 0) return;

    setUploading(true);
    setUploadingFiles(valid.map((f) => f.name));

    try {
      for (const file of valid) {
        await uploadDocument({ eventId, file });
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      setUploadingFiles([]);
      // Reset the input so the same file can be re-uploaded if needed
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  async function handleDelete(documentId: string) {
    setDeletingId(documentId);
    setError(null);
    try {
      await deleteDocument(documentId);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDownload(doc: Document) {
    setDownloadingId(doc.id);
    setError(null);
    try {
      const url = await getDocumentDownloadUrl(doc.id);
      if (!url) throw new Error("Could not generate download link.");
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      a.click();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setDownloadingId(null);
    }
  }

  const uploader = (doc: Document) => doc.uploader as { full_name: string; initials: string } | null;

  return (
    <div className="flex flex-col gap-6">
      {/* Upload zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
          uploading && "cursor-not-allowed opacity-60",
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm">
          {uploading ? (
            <LoaderIcon className="size-5 text-muted-foreground animate-spin" />
          ) : (
            <UploadIcon className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          {uploading ? (
            <>
              <p className="text-sm font-medium">
                Uploading {uploadingFiles.length === 1 ? uploadingFiles[0] : `${uploadingFiles.length} files`}…
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Please wait</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">
                Drop files here or click to upload
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                PDF, Word, Excel, images — max 10 MB each
              </p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

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
                <TableHead className="hidden sm:table-cell w-28 text-right">
                  Uploaded
                </TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const up = uploader(doc);
                const isDeleting = deletingId === doc.id;
                const isDownloading = downloadingId === doc.id;
                return (
                  <TableRow key={doc.id} className={cn(isDeleting && "opacity-50")}>
                    <TableCell className="pl-4">
                      <FileTypeIcon mimeType={doc.mime_type} />
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium truncate max-w-xs">
                        {doc.name}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatBytes(doc.size_bytes)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Avatar size="sm">
                        <AvatarFallback>
                          {up?.initials ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatDate(doc.created_at)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Download"
                          disabled={isDownloading}
                          onClick={() => handleDownload(doc)}
                        >
                          {isDownloading ? (
                            <LoaderIcon className="size-3.5 animate-spin" />
                          ) : (
                            <DownloadIcon className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive hover:text-destructive"
                          aria-label="Delete"
                          disabled={isDeleting}
                          onClick={() => handleDelete(doc.id)}
                        >
                          {isDeleting ? (
                            <LoaderIcon className="size-3.5 animate-spin" />
                          ) : (
                            <TrashIcon className="size-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <p className="text-center text-sm text-muted-foreground py-4">
          No documents uploaded yet.
        </p>
      )}
    </div>
  );
}
