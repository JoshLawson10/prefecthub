import { Workspace } from "@/types";

const WORKSPACE: Workspace = {
  name: "Cumberland HS Prefects 2026",
  school: "Cumberland High School",
  year: 2026,
  created_at: "1 February 2026",
  created_at_sort: "2026-02-01",
};

export function getWorkspace(): Workspace {
  return { ...WORKSPACE };
}
