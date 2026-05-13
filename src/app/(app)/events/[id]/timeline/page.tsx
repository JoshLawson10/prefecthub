// Timeline is derived — union query across tasks, correspondence, notes, documents
// No writes happen on this page
export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Timeline for event {id} — TODO Sprint 4</div>
}
