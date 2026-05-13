// TODO Sprint 3: fetch notes for this event
export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Notes for event {id} — TODO Sprint 3</div>
}
