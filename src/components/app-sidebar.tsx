"use client"

import * as React from "react"
import { useState } from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  Users,
} from "lucide-react"
import { LuLayoutDashboard } from "react-icons/lu";
import { LuCircleParking } from "react-icons/lu";
import { NavMain } from "@/components/nav-main"
import { IoWalletOutline } from "react-icons/io5";
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavBookings } from "./nav-projects"
import CommissionSettingsModal from "@/components/settings/CommissionSettingsModal"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  company: {
    name: "Company Name",
    logo: GalleryVerticalEnd,
    plan: "Company Plan",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/overview",
      icon: LuLayoutDashboard,
    },
    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "EV Owners",
          url: "/dashboard/user-management/ev-owners",
        },
        {
          title: "Parking Space Owners",
          url: "/dashboard/user-management/parking-space-owners",
        },
      ],
    },
    {
      title: "Parking Space Management",
      url: "#",
      icon: LuCircleParking,
      items: [
        {
          title: "Waiting for Approval",
          url: "/dashboard/parking-management/waiting-for-approval",
        },
        {
          title: "Active/Approved",
          url: "/dashboard/parking-management/active-approved",
        },
        {
          title: "Inactive/Rejected",
          url: "/dashboard/parking-management/inactive-rejected",
        },
      ],
    },
    {
      title: "Payment Monitoring",
      url: "/dashboard/payment-monitoring",
      icon: IoWalletOutline,
    },
  ],
  booking: {
    title: "Booking",
    url: "#",
    icon: BookOpen,
    items: [

      { title: "Upcoming", url: "/dashboard/booking-management/upcoming" },
      { title: "Ongoing", url: "/dashboard/booking-management/ongoing" },
      { title: "Completed", url: "/dashboard/booking-management/completed" },
      { title: "Declined", url: "/dashboard/booking-management/declined" },
    ],
  },
  settings: {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      { title: "Commission", url: "#" },
      { title: "Terms & Conditions", url: "/dashboard/policies/terms-and-con" },
      { title: "Privacy Policy", url: "/dashboard/policies/privacy-policy" },
      { title: "About Us", url: "/dashboard/policies/about-us" },
      { title: "FAQ", url: "/dashboard/faq" },
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [commissionModalOpen, setCommissionModalOpen] = useState(false)

  const settingsSection = {
    ...data.settings,
    items: data.settings.items.map((item) =>
      item.title === "Commission"
        ? { ...item, onClick: () => setCommissionModalOpen(true) }
        : item
    ),
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props} className="bg-linear-to-b from-emerald-900 to-emerald-600">
        <SidebarHeader>
          <TeamSwitcher company={data.company} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} groupLabel="Platform" />
          <NavBookings section={data.booking} groupLabel="Booking" />
          <NavBookings section={settingsSection} groupLabel="Settings" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <CommissionSettingsModal
        open={commissionModalOpen}
        onOpenChange={setCommissionModalOpen}
      />
    </>
  )
}
