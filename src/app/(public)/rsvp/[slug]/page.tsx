// Public RSVP form — no auth required
// URL: /rsvp/[slug]
export default async function RsvpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <div>RSVP page for: {slug} — TODO Sprint 5</div>
}
