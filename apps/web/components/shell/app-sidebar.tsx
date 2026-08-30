"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@workspace/ui/components/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  DashboardSquare02Icon,
  Calendar03Icon,
  CalendarAdd01Icon,
  UserGroupIcon,
  ScissorsIcon,
  UserCircleIcon,
  Settings05Icon,
  ChartAnalysisIcon,
} from "@hugeicons/core-free-icons"

import { UserMenu } from "@/components/shell/user-menu"

const NAV_GROUPS = [
  {
    label: "Menu",
    items: [
      { title: "Overview", href: "/dashboard", icon: DashboardSquare02Icon },
      { title: "Analytics", href: "/dashboard/analytics", icon: ChartAnalysisIcon },
      { title: "Calendar", href: "/dashboard/calendar", icon: Calendar03Icon },
      { title: "Appointments", href: "/dashboard/appointments", icon: CalendarAdd01Icon },
      { title: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
      { title: "Services", href: "/dashboard/services", icon: ScissorsIcon },
      { title: "Staff", href: "/dashboard/staff", icon: UserCircleIcon },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Settings", href: "/dashboard/settings", icon: Settings05Icon },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = React.useCallback(
    (href: string) => {
      if (pathname === href) return true
      const isRoot = href === "/dashboard"
      return !isRoot && pathname.startsWith(`${href}/`)
    },
    [pathname],
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BookaFlow</span>
                  <span className="truncate text-xs text-muted-foreground">Booking Platform</span>
                </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                      render={<Link href={item.href} />}
                    >
                      <HugeiconsIcon icon={item.icon} className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}
