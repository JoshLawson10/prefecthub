"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StickyNoteIcon, PencilIcon, LoaderIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Note, User } from "@/lib/schemas";
import { updateNote } from "@/lib/actions/notes";
import { formatDateTime } from "@/lib/utils/format";

interface NotesViewProps {
  notes: Note[];
  userMap: Record<string, User>;
}

export function NotesView({ notes, userMap }: NotesViewProps) {
  const router = useRouter();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openEdit(note: Note) {
    setEditingNote(note);
    setTitle(note.title);
    setBody(note.body ?? "");
    setError(null);
  }

  function closeEdit() {
    setEditingNote(null);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNote) return;
    setError(null);
    setSaving(true);
    try {
      await updateNote(editingNote.id, title, body);
      closeEdit();
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <StickyNoteIcon className="size-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          No notes yet — create the first one.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => {
          const author = userMap[note.author_id];
          return (
            <Card
              key={note.id}
              className="flex flex-col hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">
                  {note.body}
                </p>
              </CardContent>
              <Separator />
              <CardFooter className="justify-between pt-3 pb-3">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {author?.initials ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">
                      {author?.full_name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(note.updated_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit note"
                  onClick={() => openEdit(note)}
                >
                  <PencilIcon className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Sheet open={!!editingNote} onOpenChange={(open) => !open && closeEdit()}>
        <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Edit note</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSave}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="edit-note-title">Title</FieldLabel>
                <Input
                  id="edit-note-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  required
                  disabled={saving}
                />
              </Field>
              <Field className="flex-1">
                <FieldLabel htmlFor="edit-note-body">Content</FieldLabel>
                <Textarea
                  id="edit-note-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  placeholder="Write your note here..."
                  className="resize-none"
                  disabled={saving}
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <SheetFooter className="px-0 py-0 gap-2">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={saving}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <LoaderIcon className="size-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
