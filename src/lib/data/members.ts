import type { Profile } from "@/types";

const MEMBERS: Profile[] = [
  {
    id: "1",
    full_name: "Josh Lawson",
    initials: "JL",
    email: "josh.lawson@cumberland.edu.au",
    role: "admin",
  },
  {
    id: "2",
    full_name: "Sophie Nguyen",
    initials: "SN",
    email: "sophie.nguyen@cumberland.edu.au",
    role: "admin",
  },
  {
    id: "3",
    full_name: "Alex Kim",
    initials: "AK",
    email: "alex.kim@cumberland.edu.au",
    role: "prefect",
  },
  {
    id: "4",
    full_name: "Mia Thompson",
    initials: "MT",
    email: "mia.thompson@cumberland.edu.au",
    role: "prefect",
  },
  {
    id: "5",
    full_name: "Ryan Patel",
    initials: "RP",
    email: "ryan.patel@cumberland.edu.au",
    role: "prefect",
  },
  {
    id: "6",
    full_name: "Emma Chen",
    initials: "EC",
    email: "emma.chen@cumberland.edu.au",
    role: "prefect",
  },
  {
    id: "7",
    full_name: "James Wu",
    initials: "JW",
    email: "james.wu@cumberland.edu.au",
    role: "prefect",
  },
];

export function getMembers(): Profile[] {
  return [...MEMBERS];
}

export function getMember(id: string): Profile | undefined {
  return MEMBERS.find((m) => m.id === id);
}

export function getMembersByRole(role: string): Profile[] {
  return MEMBERS.filter((m) => m.role === role);
}

export function totalMembers(): number {
  return MEMBERS.length;
}

export function countMembersByType(): Record<string, number> {
  return MEMBERS.reduce(
    (acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}
