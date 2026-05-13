// TODO Sprint 3: fetch correspondence logs for this event
export default async function CorrespondencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Correspondence for event {id} — TODO Sprint 3</div>
}
