"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export type AlertItem = {
    id: string;
    title: string;
    description: string;
    count: number;
    actionLabel: string;
    actionHref: string;
};

type AlertsAndNotificationsProps = {
    items?: AlertItem[];
    className?: string;
};

const defaultAlert: AlertItem = {
    id: "pending-approvals",
    title: "Pending parking space approvals",
    description: "12 new parking spaces awaiting approval",
    count: 12,
    actionLabel: "Review Now",
    actionHref: "#",
};

export default function AlertsAndNotifications({
    items = [defaultAlert],
    className,
}: AlertsAndNotificationsProps) {
    return (
        <Card
            className={cn(
                "rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30",
                className
            )}
        >
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-foreground">
                    Alerts & Notifications
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 pt-0">
                {items.map((alert) => (
                    <div key={alert.id} className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-foreground">
                                        {alert.title}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/60 dark:text-amber-400">
                                        {alert.count}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {alert.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Link
                                href={alert.actionHref}
                                className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400"
                            >
                                {alert.actionLabel}
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
