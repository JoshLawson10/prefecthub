"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavFooter } from "@/components/sidebar/nav-footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CheckSquareIcon,
  UsersIcon,
  ArchiveIcon,
  TerminalIcon,
  SettingsIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Josh Lawson",
    email: "joshua.lawson13@education.nsw.gov.au",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Events",
      url: "/events",
      icon: <CalendarCheckIcon />,
      items: [
        { title: "Prefect Afternoon Tea", url: "/events/1" },
        { title: "Yr 12 Assembly",        url: "/events/2" },
        { title: "Yr 7 Orientation Day",  url: "/events/3" },
        { title: "Farewell Ceremony",     url: "/events/4" },
      ],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: <CheckSquareIcon />,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: <CalendarDaysIcon />,
    },
    {
      title: "Members",
      url: "/members",
      icon: <UsersIcon />,
    },
    {
      title: "Archive",
      url: "/archive",
      icon: <ArchiveIcon />,
    },
  ],
  navFooter: [
    [
      {
        title: "Settings",
        url: "/settings",
        icon: <SettingsIcon />,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: <BellIcon />,
      },
    ],
    [
      {
        title: "Log out",
        url: "/logout",
        icon: <LogOutIcon />,
      },
    ],
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMainWithActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url || pathname.startsWith(item.url + "/"),
  }));

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TerminalIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold">
                  Prefect Hub
                </span>
                <span className="truncate text-muted-foreground text-xs">
                  Cumberland HS · 2026
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter user={data.user} items={data.navFooter} />
      </SidebarFooter>
    </Sidebar>
  );
}
