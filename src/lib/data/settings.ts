export interface DeviceSession {
  id: string;
  device: string;
  location: string;
  last_active: string;
  current: boolean;
}

/**
 * Supabase does not expose per-session device metadata via the JS client.
 * We return a single placeholder representing the current session so the UI
 * renders correctly. A full implementation would require a server-side call
 * to supabase.auth.admin.listUserSessions() via the admin client, which is
 * left as a future enhancement.
 */
export function getDeviceSessions(): DeviceSession[] {
  return [
    {
      id: "current",
      device: "Current browser",
      location: "Unknown",
      last_active: "Just now",
      current: true,
    },
  ];
}
