import { Header } from "@/components/ui/header";
import { NotesView } from "@/components/notes/notes-view";
import { CreateNoteSheet } from "@/components/notes/create-note-sheet";
import { getNotesByEvent } from "@/lib/data/notes";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notes = getNotesByEvent(id);

  return (
    <div>
      <Header title="Notes" actions={<CreateNoteSheet eventId={id} />} />
      <div className="mt-4">
        <NotesView notes={notes} />
      </div>
    </div>
  );
}
