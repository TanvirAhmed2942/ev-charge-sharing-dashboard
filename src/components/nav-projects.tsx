"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavBookings({
  section,
  groupLabel,
}: {
  section: {
    title: string
    url?: string
    icon?: LucideIcon | React.ElementType
    isActive?: boolean
    items: Array<{
      title: string
      url: string
      onClick?: () => void
      count?: number
    }>
  }
  groupLabel?: string
}) {
  const pathname = usePathname()

  const isItemActive = (url: string) =>
    pathname === url || (url !== "/" && pathname.startsWith(url + "/"))

  const hasActiveChild = section.items.some(
    (sub) => "url" in sub && sub.url && isItemActive(sub.url)
  )

  return (
    <SidebarGroup className="pt-4">
      {groupLabel && (
        <SidebarGroupLabel className="mb-1 px-2 text-xs font-semibold text-sidebar-foreground/70">
          {groupLabel}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={section.isActive ?? hasActiveChild}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={section.title}>
                {section.icon && <section.icon className="size-4" />}
                <span>{section.title}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full">
              <SidebarMenuSub className="w-full">
                {section.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    {subItem.onClick ? (
                      <SidebarMenuSubButton onClick={subItem.onClick}>
                        <span>
                          {subItem.title}
                          {subItem.count != null && (
                            <span className="ml-1.5 text-muted-foreground">
                              ({subItem.count})
                            </span>
                          )}
                        </span>
                      </SidebarMenuSubButton>
                    ) : (
                      <SidebarMenuSubButton asChild isActive={isItemActive(subItem.url)} className="w-full">
                        <Link href={subItem.url}>
                          <span className="w-full flex items-center justify-between">
                            {subItem.title}
                            {subItem.count != null && (
                              <span className="ml-1.5 text-black font-bold flex justify-end bg-gray-200 rounded-lg px-2 py-1">
                                {subItem.count}
                              </span>
                            )}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}
