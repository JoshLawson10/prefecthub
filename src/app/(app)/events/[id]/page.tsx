import { redirect } from 'next/navigation'

// /events/[id] → redirect to tasks tab
export default async function EventIndexPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/events/${id}/tasks`)
}
