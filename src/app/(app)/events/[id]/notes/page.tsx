import { Header } from "@/components/ui/header";
import { NotesView } from "@/components/notes/notes-view";
import { CreateNoteSheet } from "@/components/notes/create-note-sheet";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Header title="Notes" actions={<CreateNoteSheet />} />
      <div className="mt-4">
        <NotesView eventId={id} />
      </div>
    </div>
  );
}
