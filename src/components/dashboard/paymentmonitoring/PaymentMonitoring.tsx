"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import PaymentInfoModal from "./PaymentInfoModal";
const samplePayments: PaymentItem[] = [
    {
        id: "1",
        transactionId: "TXN-2025-00145",
        bookingId: "BK-2025-0001",
        payerName: "Ahmed Rahman",
        payerEmail: "ahmed.r@gmail.com",
        amount: "€120",
        date: "2025-02-01 10:32 AM",
        status: "completed",
        paymentMethod: "Credit Card",
    },
    {
        id: "2",
        transactionId: "TXN-002",
        bookingId: "BOOK-002",
        payerName: "Jane Smith",
        amount: "€32.50",
        date: "Feb 2, 2025",
        status: "pending",
        paymentMethod: "paypal",
    },
];
export type PaymentItem = {
    id: string;
    transactionId: string;
    bookingId: string;
    payerName: string;
    amount: string;
    date: string;
    status: "completed" | "pending" | "failed";
    paymentMethod?: string;
    payerEmail?: string;
};

type PaymentMonitoringProps = {
    payments?: PaymentItem[];
    onView?: (payment: PaymentItem) => void;
};

export default function PaymentMonitoring({
    payments = samplePayments,
    onView,
}: PaymentMonitoringProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
        null
    );

    const handleView = (payment: PaymentItem) => {
        setSelectedPayment(payment);
        setDialogOpen(true);
        onView?.(payment);
    };

    return (
        <>
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Payer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-sm">
                                        {payment.transactionId}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {payment.bookingId}
                                    </TableCell>
                                    <TableCell className="font-medium">{payment.payerName}</TableCell>
                                    <TableCell className="font-medium">{payment.amount}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {payment.date}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                payment.status === "completed" &&
                                                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                payment.status === "pending" &&
                                                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                payment.status === "failed" &&
                                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            )}
                                        >
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {payment.paymentMethod ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleView(payment)}
                                            className="gap-1.5"
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <PaymentInfoModal
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                payment={selectedPayment}
            />
        </>
    );
}
