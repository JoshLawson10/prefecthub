import pathlib, re

base = pathlib.Path('/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/data')

files = [
    'tasks.ts', 'notifications.ts', 'correspondence.ts',
    'notes.ts', 'documents.ts', 'eventMembers.ts',
    'rsvp.ts', 'workspaces.ts', 'notificationPreferences.ts',
]

for fname in files:
    p = base / fname
    if not p.exists():
        print(f'  skip: {fname}')
        continue

    text = p.read_text(encoding='utf-8')
    orig = text

    # Remove the cache import line
    text = re.sub(r"import \{ cache \} from \"react\";\n", '', text)

    # Unwrap: export const X = cache(\n  async (ARGS): RET => {\n
    text = re.sub(
        r'export const (\w+) = cache\(\n  async \(([^)]*)\): ([^=\n]+) => \{',
        lambda m: f'export async function {m.group(1)}({m.group(2)}): {m.group(3).strip()} {{',
        text
    )
    # Unwrap: export const X = cache(async (ARGS): RET => {\n
    text = re.sub(
        r'export const (\w+) = cache\(async \(([^)]*)\): ([^=\n{]+) => \{',
        lambda m: f'export async function {m.group(1)}({m.group(2)}): {m.group(3).strip()} {{',
        text
    )

    # Remove orphaned closing );\n left by cache() unwrapping
    text = re.sub(r'\n  \},\n\);\n', '\n}\n', text)
    text = re.sub(r'\n\};\n\);\n', '\n}\n', text)
    text = re.sub(r'\n\},\n\);\n', '\n}\n', text)

    if text != orig:
        p.write_text(text, encoding='utf-8')
        print(f'  updated: {fname}')
    else:
        print(f'  no change: {fname}')

print('done')
