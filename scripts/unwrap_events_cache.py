import pathlib, re

p = pathlib.Path('/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/data/events.ts')
text = p.read_text(encoding='utf-8')

replacements = [
    (
        'export const getArchivedEvents = cache(async (): Promise<Event[]> => {',
        'export async function getArchivedEvents(): Promise<Event[]> {'
    ),
    (
        'export const getEvent = cache(\n  async (eventId: string): Promise<Event | null> => {',
        'export async function getEvent(eventId: string): Promise<Event | null> {'
    ),
    (
        'export const getUpcomingEvents = cache(\n  async (limit?: number): Promise<Event[]> => {',
        'export async function getUpcomingEvents(limit?: number): Promise<Event[]> {'
    ),
    (
        'export const getEventsByDateRange = cache(\n  async (start: Date, end: Date): Promise<Event[]> => {',
        'export async function getEventsByDateRange(start: Date, end: Date): Promise<Event[]> {'
    ),
    (
        'export const getEventBySlug = cache(\n  async (slug: string): Promise<Event | null> => {',
        'export async function getEventBySlug(slug: string): Promise<Event | null> {'
    ),
    (
        'export const getEventStats = cache(\n  async (eventId: string): Promise<EventStats> => {',
        'export async function getEventStats(eventId: string): Promise<EventStats> {'
    ),
    (
        'export const getRsvpCount = cache(async (eventId: string): Promise<number> => {',
        'export async function getRsvpCount(eventId: string): Promise<number> {'
    ),
]

for old, new in replacements:
    text = text.replace(old, new)

text = re.sub(r'\n  \},\n\);\n', '\n}\n', text)
text = re.sub(r'\n\};\n\);\n', '\n}\n', text)
text = re.sub(r'\n\},\n\);\n', '\n}\n', text)
text = text.rstrip()
if text.endswith(');'):
    text = text[:-2].rstrip() + '\n}'
text += '\n'

p.write_text(text, encoding='utf-8')
print('done')
