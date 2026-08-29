"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  LogoutIcon,
  Settings05Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { api } from "@workspace/ui/lib/api"

export function UserMenu() {
  const { isMobile } = useSidebar()
  const [user, setUser] = React.useState<{ fullName: string; email: string } | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!api.getToken()) {
      setLoading(false)
      return
    }
    api.me().then((data) => {
      setUser(data.user)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || !user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex-1 space-y-1 group-data-[collapsible=icon]:hidden">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const initials = user.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground">
              {initials}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.fullName}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <HugeiconsIcon icon={UnfoldMoreIcon} className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-60 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-xs font-semibold text-primary-foreground">
                  {initials}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon icon={Settings05Icon} className="size-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                api.removeToken()
                if (typeof window !== "undefined") {
                  localStorage.removeItem("businessId")
                }
                window.location.href = "/"
              }}
            >
              <HugeiconsIcon icon={LogoutIcon} className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
