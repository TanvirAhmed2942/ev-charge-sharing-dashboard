"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PROGRESS_COLOR_CLASSES = {
    blue: "[&_[data-slot=progress-indicator]]:!bg-blue-500",
    purple: "[&_[data-slot=progress-indicator]]:!bg-purple-500",
    orange: "[&_[data-slot=progress-indicator]]:!bg-orange-500",
} as const;

export type ParkingSpaceItem = {
    rank: number;
    name: string;
    bookings: number;
    revenue: number;
    /** 0–100, used for progress bar width */
    progress: number;
    progressColor?: keyof typeof PROGRESS_COLOR_CLASSES;
};

type ParkingSpacesProps = {
    items: ParkingSpaceItem[];
    className?: string;
};

export default function ParkingSpaces({ items, className }: ParkingSpacesProps) {
    return (
        <Card className={cn("rounded-xl border bg-card", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground">
                    Top Parking Spaces
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-6 pb-6 pt-0">
                {items.map((item) => (
                    <div
                        key={item.name}
                        className="flex flex-wrap items-center gap-3 gap-y-2"
                    >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                            {item.rank}
                        </div>
                        <span className="min-w-0 shrink-0 text-sm font-medium text-foreground">
                            {item.name}
                        </span>
                        <div
                            className={cn(
                                "min-w-0 flex-1 basis-0",
                                item.progressColor && PROGRESS_COLOR_CLASSES[item.progressColor]
                            )}
                        >
                            <Progress value={item.progress} className="h-2 bg-muted" />
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {item.bookings} bookings
                        </span>
                        <span className="shrink-0 text-sm font-medium text-foreground">
                            €
                            {Number(item.revenue).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
