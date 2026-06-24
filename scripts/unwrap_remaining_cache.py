import pathlib, re

files = {
    '/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/data/dashboard.ts': [
        (
            'export const getDashboardStats = cache(async (): Promise<DashboardStats> => {',
            'export async function getDashboardStats(): Promise<DashboardStats> {'
        ),
    ],
    '/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/data/notificationPreferences.ts': [
        (
            'export const getNotificationPreferences = cache(\n  async (): Promise<Omit<UserNotificationPreferences, "user_id" | "updated_at">> => {',
            'export async function getNotificationPreferences(): Promise<Omit<UserNotificationPreferences, "user_id" | "updated_at">> {'
        ),
    ],
    '/Users/joshlawson/Desktop/2_School/4_SWE/Year 12/Assessment Tasks/Task 3 - Software Project/prefecthub/src/lib/data/users.ts': [
        (
            'export const getCurrentUser = cache(async (): Promise<User | null> => {',
            'export async function getCurrentUser(): Promise<User | null> {'
        ),
        (
            'export const getUser = cache(async (userId: string): Promise<User | null> => {',
            'export async function getUser(userId: string): Promise<User | null> {'
        ),
        (
            'export const getUserByEmail = cache(\n  async (email: string): Promise<User | null> => {',
            'export async function getUserByEmail(email: string): Promise<User | null> {'
        ),
    ],
}

for path, replacements in files.items():
    p = pathlib.Path(path)
    text = p.read_text(encoding='utf-8')
    orig = text

    # Remove cache import
    text = re.sub(r'import \{ cache \} from "react";\n', '', text)

    for old, new in replacements:
        text = text.replace(old, new)

    # Remove orphaned closing );\n left by cache() wrappers
    text = re.sub(r'\n  \},\n\);\n', '\n}\n', text)
    text = re.sub(r'\n\};\n\);\n', '\n}\n', text)
    text = re.sub(r'\n\},\n\);\n', '\n}\n', text)

    if text != orig:
        p.write_text(text, encoding='utf-8')
        print(f'  updated: {p.name}')
    else:
        print(f'  no change: {p.name}')

print('done')
