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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
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
        {
          title: "Event 1",
          url: "/events/#",
        },
        {
          title: "Event 2",
          url: "/events/#",
        },
      ],
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
            <SidebarMenuButton size="lg" asChild>
              <a href="/settings">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.user.name}</span>
                  <span className="truncate text-xs">{data.user.email}</span>
                </div>
              </a>
            </SidebarMenuButton>
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
