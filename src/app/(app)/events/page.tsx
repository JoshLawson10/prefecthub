"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";

const FILTERS = ["All", "Upcoming", "In Progress", "Completed"] as const;

type Filter = (typeof FILTERS)[number];

export default function EventsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  return (
    <div>
      <Header
        title="Events"
        actions={
          <Button>
            <PlusIcon /> New event
          </Button>
        }
      />

      <div className="mt-8 flex items-center gap-4">
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f;

            return (
              <Button
                key={f}
                variant={active ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
