// TODO Sprint 2: fetch event_members for this event
export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Team for event {id} — TODO Sprint 2</div>
}
