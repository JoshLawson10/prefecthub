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

interface EventNote {
  id: string;
  title: string;
  body: string;
  authorName: string;
  authorInitials: string;
  updatedAt: string;
  eventId: string;
}

const ALL_NOTES: EventNote[] = [
  {
    id: "n1",
    title: "Catering ideas & budget",
    body: "Finger food for ~150 people. Budget ~$650 from P&C. Looking at 3 vendors — local bakery, supermarket platters, or school canteen.",
    authorName: "Josh Lawson",
    authorInitials: "JL",
    updatedAt: "10 May",
    eventId: "1",
  },
  {
    id: "n2",
    title: "Run sheet draft",
    body: "3:00 PM — Doors open, music starts. 3:15 PM — Welcome speech. 3:30 PM — Catering served. 4:30 PM — Games and activities.",
    authorName: "Sophie Nguyen",
    authorInitials: "SN",
    updatedAt: "9 May",
    eventId: "1",
  },
  {
    id: "n3",
    title: "Decoration checklist",
    body: "Navy + gold colour scheme. Balloon arch at entrance. Tablecloths x10. Photo wall backdrop. Fairy lights for tables.",
    authorName: "Mia Thompson",
    authorInitials: "MT",
    updatedAt: "7 May",
    eventId: "1",
  },
  {
    id: "n4",
    title: "Assembly order of service",
    body: "1. Welcome by principal. 2. Prefect address. 3. Year group recognition. 4. Awards. 5. Close.",
    authorName: "Alex Kim",
    authorInitials: "AK",
    updatedAt: "8 May",
    eventId: "2",
  },
];

interface NotesViewProps {
  eventId?: string;
}

export function NotesView({ eventId }: NotesViewProps) {
  const notes = eventId
    ? ALL_NOTES.filter((n) => n.eventId === eventId)
    : ALL_NOTES;

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
                <AvatarFallback>{note.authorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{note.authorName}</p>
                <p className="text-xs text-muted-foreground">
                  {note.updatedAt}
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
