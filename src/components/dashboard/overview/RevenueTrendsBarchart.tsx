"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export type RevenueTrendsDataPoint = {
    day: string;
    revenue: number;
};

type RevenueTrendsBarchartProps = {
    data: RevenueTrendsDataPoint[];
    className?: string;
};

const PERIODS = ["Daily", "Monthly"] as const;

export default function RevenueTrendsBarchart({
    data,
    className,
}: RevenueTrendsBarchartProps) {
    const [period, setPeriod] = useState<"Daily" | "Monthly">("Daily");

    return (
        <Card className={cn("rounded-xl border bg-card", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-2">
                <h3 className="text-base font-bold text-card-foreground">
                    Revenue Overview
                </h3>
                <div className="flex rounded-lg border bg-muted/30 p-0.5">
                    {PERIODS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                period === p
                                    ? "bg-emerald-600 text-white"
                                    : "bg-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="revenueFill"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="rgb(5 150 105)"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor="rgb(5 150 105)"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => String(v)}
                                domain={[0, "auto"]}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "var(--radius)",
                                    border: "1px solid hsl(var(--border))",
                                }}
                                formatter={(value) => [value ?? 0, "revenue"]}
                                labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: "8px" }}
                                formatter={() => (
                                    <span className="text-sm text-emerald-600">→ revenue</span>
                                )}
                                iconSize={0}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="rgb(5 150 105)"
                                strokeWidth={2}
                                fill="url(#revenueFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
