
import { AppSidebar } from "@/components/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { DashboardHeaderUser } from "@/components/dashboard/DashboardHeaderUser";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";
import Notification from "@/components/common/notification/Notification";



export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <AuthLayoutWrapper
            allowedRoles={["super_admin"]}
            requireAuth={true}
            redirectOnMount={true}
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 z-10 bg-background">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
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

