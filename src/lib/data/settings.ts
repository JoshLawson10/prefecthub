import { DeviceSession } from "@/types";

const SESSIONS: DeviceSession[] = [
  {
    id: "s1",
    device: "MacBook Pro — Chrome",
    location: "Sydney, NSW",
    last_active: "Now",
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15 — Safari",
    location: "Sydney, NSW",
    last_active: "2 hours ago",
    current: false,
  },
];

export function getDeviceSessionById(id: string): DeviceSession | null {
  return SESSIONS.find((s) => s.id === id) ?? null;
}

export function getDeviceSessions(): DeviceSession[] {
  return SESSIONS;
}

export function getActiveSessions(): DeviceSession[] | null {
  return SESSIONS.filter((s) => s.current) ?? null;
}

export function revokeSession(id: string): boolean {
  console.log(`Revoking session ${id}`);
  return true;
}

export function revokeAllSessions(): boolean {
  console.log("Revoking all sessions");
  return true;
}
