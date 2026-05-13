// TODO Sprint 3: fetch documents for this event
export default async function DocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Documents for event {id} — TODO Sprint 3</div>
}
