"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, User, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaymentItem } from "./PaymentMonitoring";

type PaymentInfoModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment: PaymentItem | null;
};

function statusLabel(status: PaymentItem["status"]): string {
    switch (status) {
        case "completed":
            return "Success";
        case "pending":
            return "Pending";
        case "failed":
            return "Failed";
        default:
            return status;
    }
}

export default function PaymentInfoModal({
    open,
    onOpenChange,
    payment,
}: PaymentInfoModalProps) {
    if (!payment) return null;

    const isSuccess = payment.status === "completed";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl text-left">
                <DialogHeader className="text-left">
                    <DialogTitle>Payment Details</DialogTitle>
                    <p className="text-sm text-muted-foreground font-normal">
                        {payment.transactionId}
                    </p>
                </DialogHeader>
                <div className="mt-2 space-y-5">
                    {/* Status */}
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                isSuccess && "bg-emerald-500",
                                payment.status === "pending" && "bg-amber-500",
                                payment.status === "failed" && "bg-red-500"
                            )}
                        >
                            <CheckCircle2 className="h-5 w-5 text-white" />
                        </div>
                        <span
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-medium",
                                isSuccess &&
                                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                                payment.status === "pending" &&
                                "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
                                payment.status === "failed" &&
                                "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                            )}
                        >
                            {statusLabel(payment.status)}
                        </span>
                    </div>

                    {/* Transaction Amount */}
                    <Card className="rounded-lg border bg-muted/30">
                        <CardContent className="pt-4">
                            <p className="text-xs text-muted-foreground">
                                Transaction Amount
                            </p>
                            <p className="mt-1 text-2xl font-bold text-foreground">
                                {payment.amount}
                            </p>
                        </CardContent>
                    </Card>

                    {/* User Information & Payment Information - two columns */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Card className="rounded-lg border">
                            <CardContent className="pt-4">
                                <h4 className="text-sm font-bold text-foreground">
                                    User Information
                                </h4>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span>{payment.payerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="ml-6">
                                            {payment.payerEmail ?? "—"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-lg border">
                            <CardContent className="pt-4">
                                <h4 className="text-sm font-bold text-foreground">
                                    Payment Information
                                </h4>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="capitalize">
                                            {payment.paymentMethod ?? "—"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span>{payment.date}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Related Booking */}
                    <Card className="rounded-lg border">
                        <CardContent className="pt-4">
                            <h4 className="text-sm font-bold text-foreground">
                                Related Booking
                            </h4>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Booking ID: {payment.bookingId}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
