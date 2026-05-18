import type { CorrespondenceLog } from "@/types";

const LOGS: CorrespondenceLog[] = [
  {
    id: "l1",
    type: "email",
    subject: "PAT catering budget approval",
    body: "Requested $650 from P&C for catering at the Prefect Afternoon Tea.",
    contact_name: "Ms Carter",
    contact_email: "carter@cumberland.edu.au",
    logged_by_name: "Josh Lawson",
    logged_by_initials: "JL",
    date: "12 May",
    event_id: "1",
  },
  {
    id: "l2",
    type: "phone",
    subject: "Hall B booking confirmed",
    body: "Called to reserve Hall B for 30 May, 3-5 PM. Confirmed by admin.",
    contact_name: "Mrs Patel",
    contact_email: "patel@cumberland.edu.au",
    logged_by_name: "Josh Lawson",
    logged_by_initials: "JL",
    date: "8 May",
    event_id: "1",
  },
  {
    id: "l3",
    type: "meeting",
    subject: "PAT planning — prefect body",
    body: "Discussed catering, decorations, run sheet, and RSVP targets.",
    contact_name: "All prefects",
    contact_email: null,
    logged_by_name: "Sophie Nguyen",
    logged_by_initials: "SN",
    date: "5 May",
    event_id: "1",
  },
  {
    id: "l4",
    type: "note",
    subject: "Catering vendor shortlist",
    body: "Three vendors researched — local bakery, supermarket, school canteen.",
    contact_name: "Internal note",
    contact_email: null,
    logged_by_name: "Josh Lawson",
    logged_by_initials: "JL",
    date: "3 May",
    event_id: "1",
  },
  {
    id: "l5",
    type: "email",
    subject: "Yr 7 orientation — teacher volunteers",
    body: "Asked Mr Nguyen to coordinate teacher supervisors for the day.",
    contact_name: "Mr Nguyen",
    contact_email: "nguyen@cumberland.edu.au",
    logged_by_name: "Alex Kim",
    logged_by_initials: "AK",
    date: "5 May",
    event_id: "3",
  },
  {
    id: "l6",
    type: "meeting",
    subject: "Assembly AV requirements",
    body: "Need microphone, projector, and clicker for 26 May assembly.",
    contact_name: "AV team",
    contact_email: null,
    logged_by_name: "Mia Thompson",
    logged_by_initials: "MT",
    date: "4 May",
    event_id: "2",
  },
];

export function getCorrespondenceByEvent(eventId: string): CorrespondenceLog[] {
  return LOGS.filter((l) => l.event_id === eventId);
}

export function getCorrespondenceLog(
  id: string,
): CorrespondenceLog | undefined {
  return LOGS.find((l) => l.id === id);
}
