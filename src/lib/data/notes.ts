import type { EventNote } from "@/types";

const NOTES: EventNote[] = [
  {
    id: "n1",
    title: "Catering ideas & budget",
    body: "Finger food for ~150 people. Budget ~$650 from P&C. Looking at 3 vendors — local bakery, supermarket platters, or school canteen.",
    author_name: "Josh Lawson",
    author_initials: "JL",
    updated_at: "10 May",
    event_id: "1",
  },
  {
    id: "n2",
    title: "Run sheet draft",
    body: "3:00 PM — Doors open, music starts. 3:15 PM — Welcome speech. 3:30 PM — Catering served. 4:30 PM — Games and activities.",
    author_name: "Sophie Nguyen",
    author_initials: "SN",
    updated_at: "9 May",
    event_id: "1",
  },
  {
    id: "n3",
    title: "Decoration checklist",
    body: "Navy + gold colour scheme. Balloon arch at entrance. Tablecloths x10. Photo wall backdrop. Fairy lights for tables.",
    author_name: "Mia Thompson",
    author_initials: "MT",
    updated_at: "7 May",
    event_id: "1",
  },
  {
    id: "n4",
    title: "Assembly order of service",
    body: "1. Welcome by principal. 2. Prefect address. 3. Year group recognition. 4. Awards. 5. Close.",
    author_name: "Alex Kim",
    author_initials: "AK",
    updated_at: "8 May",
    event_id: "2",
  },
];

export function getNotesByEvent(eventId: string): EventNote[] {
  return NOTES.filter((n) => n.event_id === eventId);
}

export function getNote(id: string): EventNote | undefined {
  return NOTES.find((n) => n.id === id);
}
