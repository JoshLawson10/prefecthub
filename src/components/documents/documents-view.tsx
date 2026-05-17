"use client";

import { useRef } from "react";
import {
  FileTextIcon, FileSpreadsheetIcon, FileImageIcon,
  FileIcon, DownloadIcon, TrashIcon, UploadIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface EventDocument {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  uploadedBy: string;
  uploadedByInitials: string;
  date: string;
  eventId: string;
}

const ALL_DOCS: EventDocument[] = [
  { id: "d1", name: "PAT_RunSheet_v2.pdf",          mimeType: "application/pdf",  size: "248 KB", uploadedBy: "Josh Lawson",   uploadedByInitials: "JL", date: "11 May", eventId: "1" },
  { id: "d2", name: "PAT_CateringQuotes.xlsx",       mimeType: "application/xlsx", size: "82 KB",  uploadedBy: "Sophie Nguyen", uploadedByInitials: "SN", date: "9 May",  eventId: "1" },
  { id: "d3", name: "PandC_FundingLetter_FINAL.docx",mimeType: "application/docx", size: "36 KB",  uploadedBy: "Josh Lawson",   uploadedByInitials: "JL", date: "8 May",  eventId: "1" },
  { id: "d4", name: "HallB_FloorPlan.jpg",           mimeType: "image/jpeg",       size: "1.2 MB", uploadedBy: "Josh Lawson",   uploadedByInitials: "JL", date: "5 May",  eventId: "1" },
  { id: "d5", name: "Assembly_RunSheet.pdf",         mimeType: "application/pdf",  size: "156 KB", uploadedBy: "Alex Kim",      uploadedByInitials: "AK", date: "10 May", eventId: "2" },
];

function FileTypeIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  const base = cn("size-4 shrink-0", className);
  if (mimeType.includes("pdf"))   return <FileTextIcon       className={cn(base, "text-rose-500")} />;
  if (mimeType.includes("xlsx") || mimeType.includes("sheet")) return <FileSpreadsheetIcon className={cn(base, "text-emerald-500")} />;
  if (mimeType.includes("image")) return <FileImageIcon      className={cn(base, "text-blue-500")} />;
  return                                 <FileIcon           className={cn(base, "text-muted-foreground")} />;
}

interface DocumentsViewProps {
  eventId?: string;
}

export function DocumentsView({ eventId }: DocumentsViewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const docs = eventId ? ALL_DOCS.filter((d) => d.eventId === eventId) : ALL_DOCS;

  return (
    <div className="flex flex-col gap-6">
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 transition-colors hover:border-primary/40 hover:bg-muted/40"
      >
        <div className="flex size-10 items-center justify-center rounded-full bg-background shadow-sm">
          <UploadIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Drop files here or click to upload</p>
          <p className="mt-0.5 text-xs text-muted-foreground">PDF, Word, Excel, images — max 10 MB each</p>
        </div>
        <input ref={inputRef} type="file" multiple className="hidden" />
      </div>

      {/* File list */}
      {docs.length > 0 && (
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
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="pl-4">
                    <FileTypeIcon mimeType={doc.mimeType} />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium truncate max-w-xs">{doc.name}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground tabular-nums">{doc.size}</span>
                  </TableCell>
                  <TableCell>
                    <Avatar size="sm"><AvatarFallback>{doc.uploadedByInitials}</AvatarFallback></Avatar>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">
                    <span className="text-xs text-muted-foreground tabular-nums">{doc.date}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-sm"><DownloadIcon className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive"><TrashIcon className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {docs.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">No documents uploaded yet.</p>
      )}
    </div>
  );
}
