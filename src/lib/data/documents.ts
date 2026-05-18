import type { EventDocument } from "@/types";

const DOCUMENTS: EventDocument[] = [
  {
    id: "d1",
    name: "PAT_RunSheet_v2.pdf",
    mime_type: "application/pdf",
    size: "248 KB",
    uploaded_by_name: "Josh Lawson",
    uploaded_by_initials: "JL",
    date: "11 May",
    event_id: "1",
  },
  {
    id: "d2",
    name: "PAT_CateringQuotes.xlsx",
    mime_type: "application/xlsx",
    size: "82 KB",
    uploaded_by_name: "Sophie Nguyen",
    uploaded_by_initials: "SN",
    date: "9 May",
    event_id: "1",
  },
  {
    id: "d3",
    name: "PandC_FundingLetter_FINAL.docx",
    mime_type: "application/docx",
    size: "36 KB",
    uploaded_by_name: "Josh Lawson",
    uploaded_by_initials: "JL",
    date: "8 May",
    event_id: "1",
  },
  {
    id: "d4",
    name: "HallB_FloorPlan.jpg",
    mime_type: "image/jpeg",
    size: "1.2 MB",
    uploaded_by_name: "Josh Lawson",
    uploaded_by_initials: "JL",
    date: "5 May",
    event_id: "1",
  },
  {
    id: "d5",
    name: "Assembly_RunSheet.pdf",
    mime_type: "application/pdf",
    size: "156 KB",
    uploaded_by_name: "Alex Kim",
    uploaded_by_initials: "AK",
    date: "10 May",
    event_id: "2",
  },
];

export function getDocumentsByEvent(eventId: string): EventDocument[] {
  return DOCUMENTS.filter((d) => d.event_id === eventId);
}

export function getDocument(id: string): EventDocument | undefined {
  return DOCUMENTS.find((d) => d.id === id);
}
