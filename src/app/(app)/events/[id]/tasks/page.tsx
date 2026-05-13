// TODO Sprint 2: fetch tasks for this event, render TaskTable
export default async function TasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <div>Tasks for event {id} — TODO Sprint 2</div>
}
