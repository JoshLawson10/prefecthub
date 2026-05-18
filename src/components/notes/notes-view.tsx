"use client";

import { StickyNoteIcon, PencilIcon } from "lucide-react";
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
import type { EventNote } from "@/types";

interface NotesViewProps {
  notes: EventNote[];
}

export function NotesView({ notes }: NotesViewProps) {
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="flex flex-col cursor-pointer hover:shadow-md transition-shadow"
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
                <AvatarFallback>{note.author_initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{note.author_name}</p>
                <p className="text-xs text-muted-foreground">
                  {note.updated_at}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm">
              <PencilIcon className="size-3.5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
