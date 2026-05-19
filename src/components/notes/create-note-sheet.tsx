"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/lib/actions";

interface CreateNoteSheetProps {
  eventId: string;
}

export function CreateNoteSheet({ eventId }: CreateNoteSheetProps) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setLoading(true);
    await createNote({
      eventId,
      title: data.get("title") as string,
      body:  data.get("body")  as string,
    });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon /> New note
      </Button>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>New note</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="note-title">Title</FieldLabel>
              <Input id="note-title" name="title" placeholder="Note title" required />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="note-body">Content</FieldLabel>
              <Textarea
                id="note-body"
                name="body"
                rows={12}
                placeholder="Write your note here..."
                className="resize-none"
                required
              />
            </Field>
          </FieldGroup>
          <SheetFooter className="px-0 py-0 gap-2">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save note"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
