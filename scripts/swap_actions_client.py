import pathlib, re

base = pathlib.Path('/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/actions')

# These action files do DB mutations and should use createQueryClient,
# NOT auth actions (auth.ts, profile.ts) which need the session client
mutation_files = [
    'tasks.ts', 'notes.ts', 'correspondence.ts', 'invitations.ts',
    'documents.ts', 'eventMembers.ts', 'members.ts', 'rsvp.ts',
    'workspaces.ts', 'notificationPreferences.ts', 'users.ts',
    'notifications.ts', 'analytics.ts',
]

OLD_IMPORT = 'import { createClient } from "@/lib/supabase/server";'
NEW_IMPORT = 'import { createQueryClient } from "@/lib/supabase/query";'
OLD_CALL = 'await createClient()'
NEW_CALL = 'createQueryClient()'

for fname in mutation_files:
    p = base / fname
    if not p.exists():
        continue
    text = p.read_text(encoding='utf-8')
    orig = text
    text = text.replace(OLD_IMPORT, NEW_IMPORT)
    text = text.replace(OLD_CALL, NEW_CALL)
    if text != orig:
        p.write_text(text, encoding='utf-8')
        print(f'  updated: {fname}')
    else:
        print(f'  no change: {fname}')

print('done')
