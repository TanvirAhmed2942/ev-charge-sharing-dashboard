"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Clock, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingStatusType =
    | "upcoming"
    | "ongoing"
    | "completed"
    | "declined";
export type PaymentStatusType = "paid" | "pending" | "refunded" | "unpaid";

export type BookingListCardProps = {
    bookingId: string;
    statusType: BookingStatusType;
    paymentStatus: PaymentStatusType;
    userName: string;
    timeRange: string;
    location: string;
    date: string;
    amount: string;
    onViewDetails?: () => void;
    className?: string;
};

const statusTypeLabel: Record<BookingStatusType, string> = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
    declined: "Declined",
};

const statusTypeClass: Record<BookingStatusType, string> = {
    upcoming:
        "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    ongoing:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    completed:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    declined:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const paymentStatusLabel: Record<PaymentStatusType, string> = {
    paid: "Paid",
    pending: "Pending",
    refunded: "Refunded",
    unpaid: "Unpaid",
};

const paymentStatusClass: Record<PaymentStatusType, string> = {
    paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    refunded: "bg-muted text-muted-foreground",
    unpaid: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function BookingListCard({
    bookingId,
    statusType,
    paymentStatus,
    userName,
    timeRange,
    location,
    date,
    amount,
    onViewDetails,
    className,
}: BookingListCardProps) {
    return (
        <Card
            className={cn(
                "rounded-lg border border-border/50 bg-card py-4 shadow-none sm:py-5",
                className
            )}
        >
            <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
                {/* Top: Booking ID, badges, amount, View Details */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-foreground">
                            {bookingId}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                statusTypeClass[statusType]
                            )}
                        >
                            {statusTypeLabel[statusType]}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                paymentStatusClass[paymentStatus]
                            )}
                        >
                            {paymentStatusLabel[paymentStatus]}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                                Amount
                            </p>
                            <p className="font-bold text-foreground">
                                {amount}
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={onViewDetails}
                            className="rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
                        >
                            View Details
                        </Button>
                    </div>
                </div>

                {/* Two-column details: User, Time | Location, Date */}
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 shrink-0" />
                        <span>{userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{timeRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{date}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
