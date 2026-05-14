"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface RouteTab {
  label: string;
  href: string;
}

interface RouteTabsProps {
  tabs: RouteTab[];
  basePath?: string;
  className?: string;
}

export function EventTabs({ tabs, basePath, className }: RouteTabsProps) {
  const pathname = usePathname();

  const resolvedBasePath =
    basePath ??
    (() => {
      const segments = pathname.split("/").filter(Boolean);

      return `/${segments.slice(0, 2).join("/")}`;
    })();

  return (
    <div className={cn("border-b", className)}>
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => {
          const href =
            tab.href === ""
              ? resolvedBasePath
              : `${resolvedBasePath}/${tab.href}`;

          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "text-muted-foreground hover:text-foreground relative px-4 py-3 text-sm font-medium transition-colors",
                isActive && "text-foreground",
              )}
            >
              {tab.label}

              {isActive && (
                <motion.div
                  layoutId="route-tabs-underline"
                  className="bg-primary absolute bottom-0 left-0 h-0.5 w-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
