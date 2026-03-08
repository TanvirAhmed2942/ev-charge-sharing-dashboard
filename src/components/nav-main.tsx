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

export function NavMain({
  items,
  groupLabel,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | React.ElementType
    isActive?: boolean
    items?: {
      title: string
      url: string
      count?: number
    }[]
  }[]
  groupLabel?: string
}) {
  const pathname = usePathname()

  const isItemActive = (url: string) =>
    pathname === url || (url !== "/" && pathname.startsWith(url + "/"))

  return (
    <SidebarGroup>
      {groupLabel && (
        <SidebarGroupLabel className="mb-1 px-2 text-xs font-semibold text-sidebar-foreground/70">
          {groupLabel}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild = item.items?.some((sub) => isItemActive(sub.url))
          const isActive = !item.items ? isItemActive(item.url) : false
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive ?? hasActiveChild}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.url}>
                      {item.icon && <item.icon className="size-4" />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                <CollapsibleContent className="w-full">
                  <SidebarMenuSub className="w-full">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isItemActive(subItem.url)}>
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
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
