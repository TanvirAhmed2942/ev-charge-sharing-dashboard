"use client";

import { useMemo, useState } from "react";
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
import { Eye, Loader } from "lucide-react";
import PaymentInfoModal from "./PaymentInfoModal";
import { useGetPaymentQuery } from "@/store/Apis/paymentApi/paymentApi";
import type { PaymentResultItem } from "@/store/Apis/paymentApi/paymentApi";

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

function formatPaymentDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function apiStatusToUiStatus(status: string): PaymentItem["status"] {
  if (status === "paid") return "completed";
  if (status === "pending" || status === "refunded") return "pending";
  return "failed";
}

function mapResultToPaymentItem(item: PaymentResultItem): PaymentItem {
  return {
    id: item._id,
    transactionId: item.transactionId,
    bookingId: item.bookingParkingPlaceId,
    payerName: item.userId?.email ?? "—",
    amount: `€${item.totalAmount}`,
    date: formatPaymentDate(item.transactionDate ?? item.createdAt),
    status: apiStatusToUiStatus(item.status),
    paymentMethod: item.method,
    payerEmail: item.userId?.email,
  };
}

export default function PaymentMonitoring() {
  const { data, isLoading } = useGetPaymentQuery({ page: 1, limit: 10 });
  const payments = useMemo(
    () => (data?.data?.result ?? []).map(mapResultToPaymentItem),
    [data?.data?.result]
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null);

  const handleView = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    Loading payments…
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
