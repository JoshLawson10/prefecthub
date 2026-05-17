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

export function CreateNoteSheet() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon /> New note
      </Button>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-lg p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle>New note</SheetTitle>
        </SheetHeader>
        <form className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="note-title">Title</FieldLabel>
              <Input id="note-title" name="title" placeholder="Note title" />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="note-body">Content</FieldLabel>
              <Textarea
                id="note-body"
                name="body"
                rows={12}
                placeholder="Write your note here..."
                className="resize-none"
              />
            </Field>
          </FieldGroup>
        </form>
        <SheetFooter className="px-6 py-4 border-t gap-2">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button type="submit">Save note</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
