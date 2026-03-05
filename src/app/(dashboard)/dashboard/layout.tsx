import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { DashboardHeaderUser } from "@/components/dashboard/DashboardHeaderUser";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthLayoutWrapper
            allowedRoles={["admin", "super_admin"]}
            requireAuth={true}
            redirectOnMount={true}
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 z-10 bg-background">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Overview</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <div className="flex items-center gap-4">
                            <Notification />
                            <Separator
                                orientation="vertical"
                                className="mr-0 data-[orientation=vertical]:h-4"
                            />
                            <DashboardHeaderUser />
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </AuthLayoutWrapper>
    )
}

function Notification() {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full hover:bg-muted">
                <Bell className="size-4" />
            </Button>
        </div>
    )
}