"use client"

import * as React from "react"

import {
  SidebarMenu,

  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  company,
}: {
  company: {
    name: string
    logo: React.ElementType
    plan: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-300 hover:text-sidebar-accent-foreground">
        <div className="bg-amber-500 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <company.logo className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{company.name}</span>
          <span className="truncate text-xs">{company.plan}</span>
        </div>

      </SidebarMenuItem>
    </SidebarMenu>
  )
}
