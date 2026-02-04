import React from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

export type StatItem = {
    label: string;
    value: string | number;
    icon: React.ReactNode;
};

type StatsProps = {
    items: StatItem[];
    className?: string;
};

function StatCard({
    label,
    value,
    icon,
    className,
}: StatItem & { className?: string }) {
    return (
        <Card
            className={cn(
                "border-0 text-emerald-50 shadow-sm",
                "bg-linear-to-r from-emerald-900 to-emerald-600",
                // "bg-conic-120 deg-45 from-emerald-900 to-emerald-600",
                "min-h-[100px] flex flex-col justify-between py-4",
                className
            )}
        >
            <CardHeader className="p-0 px-5 pb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-200/90">
                    {label}
                </span>
            </CardHeader>
            <CardContent className="flex flex-row items-end justify-between gap-3 px-5 pt-0">
                <span className="text-2xl font-bold tabular-nums text-white md:text-3xl">
                    {value}
                </span>
                <span className="flex shrink-0 text-white [&_svg]:size-8 [&_svg]:md:size-9">
                    {icon}
                </span>
            </CardContent>
        </Card>
    );
}

export default function Stats({ items, className }: StatsProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
                className
            )}
        >
            {items.map((item) => (
                <StatCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                />
            ))}
        </div>
    );
}
