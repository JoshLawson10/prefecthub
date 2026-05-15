"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SettingsTabs({
  tabs,
}: {
  tabs: { label: string; href: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-48 shrink-0">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start",
              isActive &&
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
