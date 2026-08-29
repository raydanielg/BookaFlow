"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { DashboardSquare02Icon, Calendar03Icon, CalendarAdd01Icon, UserGroupIcon, ScissorsIcon, UserCircleIcon, Settings05Icon } from "@hugeicons/core-free-icons"

const data = {
  user: {
    name: "Sarah Johnson",
    email: "owner@beauty-house.com",
    avatar: "/peercoin.png",
  },
  teams: [
    {
      name: "Beauty House",
      logo: (
        <img src="/peercoin.png" alt="Beauty House" className="size-4 rounded object-cover" />
      ),
      plan: "Salon",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: (
        <HugeiconsIcon icon={DashboardSquare02Icon} strokeWidth={2} />
      ),
      isActive: true,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: (
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Appointments",
      url: "/dashboard/appointments",
      icon: (
        <HugeiconsIcon icon={CalendarAdd01Icon} strokeWidth={2} />
      ),
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: (
        <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: (
        <HugeiconsIcon icon={ScissorsIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Staff",
      url: "/dashboard/staff",
      icon: (
        <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />
      ),
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: (
        <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
