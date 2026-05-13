import { createClient } from '@/lib/supabase/server'
import { EventHeader } from '@/components/events/EventHeader'
import { notFound } from 'next/navigation'

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

// Fetches the event once — all child tab pages inherit this context.
// Tab pages (tasks, correspondence, etc.) never re-fetch the event header.
export default async function EventLayout({ children, params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (!event) notFound()

  return (
    <div className="flex flex-col h-full">
      <EventHeader event={event} />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  )
}
