"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Clock,
    Euro,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingStatusType, PaymentStatusType } from "@/components/common/bookinglist/BookingListCard";

export type BookingDetails = {
    bookingId: string;
    statusType: BookingStatusType;
    paymentStatus: PaymentStatusType;
    userName: string;
    userEmail: string;
    parkingSpaceName: string;
    parkingSpaceAddress: string;
    date: string;
    timeRange: string;
    duration: string;
    amount: string;
};

type BookingViewDetailsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    booking: BookingDetails | null;
};

const statusTypeLabel: Record<BookingStatusType, string> = {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    completed: "Completed",
    declined: "Declined",
};

const statusTypeClass: Record<BookingStatusType, string> = {
    upcoming: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    ongoing: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    declined: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
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
    unpaid: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

export default function BookingViewDetails({
    open,
    onOpenChange,
    booking,
}: BookingViewDetailsProps) {
    if (!booking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90dvh] flex-col gap-0 p-0 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg md:max-w-xl">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 text-left">
                    <DialogTitle className="text-base sm:text-lg">
                        Booking Details
                    </DialogTitle>
                    <p className="text-sm font-normal text-muted-foreground">
                        {booking.bookingId}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                statusTypeClass[booking.statusType]
                            )}
                        >
                            {statusTypeLabel[booking.statusType]}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                paymentStatusClass[booking.paymentStatus]
                            )}
                        >
                            Payment: {paymentStatusLabel[booking.paymentStatus]}
                        </span>
                    </div>
                </DialogHeader>

                <ScrollArea className="min-h-0 flex-1 border-t border-border/50">
                    <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* User Information */}
                            <Card className="rounded-lg border">
                                <CardContent className="p-4">
                                    <h4 className="text-sm font-bold text-foreground">
                                        User Information
                                    </h4>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="h-4 w-4 shrink-0" />
                                            <span>{booking.userName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-4 w-4 shrink-0" />
                                            <span>{booking.userEmail}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Parking Space */}
                            <Card className="rounded-lg border">
                                <CardContent className="p-4">
                                    <h4 className="text-sm font-bold text-foreground">
                                        Parking Space
                                    </h4>
                                    <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium text-foreground">
                                            {booking.parkingSpaceName}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span>{booking.parkingSpaceAddress}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>


                        {/* Booking Schedule */}
                        <Card className="rounded-lg border">
                            <CardContent className="p-4">
                                <h4 className="text-sm font-bold text-foreground">
                                    Booking Schedule
                                </h4>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground/80">Date</p>
                                            <p className="font-medium text-foreground">{booking.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                                        <div>
                                            <p className="text-xs text-muted-foreground/80">Time</p>
                                            <p className="font-medium text-foreground">{booking.timeRange}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-muted-foreground sm:col-span-2">
                                        <div>
                                            <p className="text-xs text-muted-foreground/80">Duration</p>
                                            <p className="font-medium text-foreground">{booking.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card className="overflow-hidden rounded-lg border-0 bg-emerald-50 dark:bg-emerald-950/20">
                            <CardContent className="flex flex-row items-center justify-between gap-4 p-4">
                                <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
                                    <Euro className="h-4 w-4 shrink-0" />
                                    <span>Total Amount</span>
                                </div>
                                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                    {booking.amount}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
