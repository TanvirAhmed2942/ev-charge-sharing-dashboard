"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export type BookingTrendsDataPoint = {
    day: string;
    bookings: number;
};

type BookingTrendsBarchartProps = {
    data: BookingTrendsDataPoint[];
    className?: string;
};

const PERIODS = ["Daily", "Monthly"] as const;

export default function BookingTrendsBarchart({
    data,
    className,
}: BookingTrendsBarchartProps) {
    const [period, setPeriod] = useState<"Daily" | "Monthly">("Daily");

    return (
        <Card className={cn("rounded-xl border bg-card", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-2">
                <h3 className="text-base font-bold text-card-foreground">
                    Booking Trends
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
                                    ? "bg-sky-500 text-white"
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
                        <LineChart
                            data={data}
                            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                        >
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
                                formatter={(value) => [value ?? 0, "bookings"]}
                                labelFormatter={(label) => `Day: ${label}`}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: "8px" }}
                                formatter={() => (
                                    <span className="text-sm text-sky-500">→ bookings</span>
                                )}
                                iconSize={0}
                            />
                            <Line
                                type="monotone"
                                dataKey="bookings"
                                stroke="rgb(14 165 233)"
                                strokeWidth={2}
                                dot={{ fill: "rgb(14 165 233)", r: 4 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
