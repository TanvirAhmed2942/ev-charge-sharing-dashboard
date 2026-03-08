"use client";

import { useState, useMemo } from "react";
import BookingListCard from "@/components/common/bookinglist/BookingListCard";
import type { BookingStatusType } from "@/components/common/bookinglist/BookingListCard";
import BookingViewDetails, {
    type BookingDetails,
} from "@/components/dashboard/booking-management/BookingViewDetails";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import Pagination from "@/components/common/pagination/Pagination";
import { usePathname } from "next/navigation";
import {
    useGetBookingsQuery,
    type BookingResultItem,
} from "@/store/Apis/bookingApi/bookingApi";
import { Loader } from "lucide-react";

const PATH_TO_STATUS: Record<string, string> = {
    "/dashboard/booking-management/upcoming": "pending",
    "/dashboard/booking-management/ongoing": "accept",
    "/dashboard/booking-management/completed": "complete",
    "/dashboard/booking-management/declined": "cancel",
};

const DEFAULT_LIMIT = 10;

function pathnameToStatus(pathname: string): string | null {
    return PATH_TO_STATUS[pathname] ?? null;
}

/** Maps API status to UI booking status: pending→upcoming, accept→ongoing, complete→completed, cancel→declined, daft→upcoming */
function apiStatusToBookingStatusType(apiStatus: string): BookingStatusType {
    const s = (apiStatus || "").toLowerCase();
    if (s === "accept" || s === "accepted") return "ongoing";
    if (s === "complete" || s === "completed") return "completed";
    if (s === "cancel" || s === "cancelled" || s === "declined") return "declined";
    if (s === "pending" || s === "daft") return "upcoming";
    return "upcoming";
}

function formatBookingDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return iso;
    }
}

function formatTimeRange(startIso: string, endIso: string): string {
    try {
        const start = new Date(startIso);
        const end = new Date(endIso);
        return `${start.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
        return "—";
    }
}

function formatDuration(startIso: string, endIso: string): string {
    try {
        const start = new Date(startIso).getTime();
        const end = new Date(endIso).getTime();
        const mins = Math.round((end - start) / 60000);
        if (mins < 60) return `${mins} min`;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return m ? `${h}h ${m}m` : `${h} hour${h > 1 ? "s" : ""}`;
    } catch {
        return "—";
    }
}

function mapResultToDetails(item: BookingResultItem): BookingDetails {
    const statusType = apiStatusToBookingStatusType(item.status);
    const paymentStatus = item.status?.toLowerCase() === "daft" ? "unpaid" : "paid";
    return {
        bookingId: item._id,
        statusType,
        paymentStatus,
        userName: item.userId?.fullName ?? item.userId?.email ?? "—",
        userEmail: item.userId?.email ?? "—",
        parkingSpaceName: item.parkingPlaceId?.name ?? "—",
        parkingSpaceAddress: item.parkingPlaceId?.locationAddress ?? "—",
        date: formatBookingDate(item.bookingDate),
        timeRange: formatTimeRange(item.startTime, item.endTime),
        duration: formatDuration(item.startTime, item.endTime),
        amount: `€${item.amount}`,
    };
}

function BookingManagementLayout() {
    const pathname = usePathname();
    const status = pathnameToStatus(pathname);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(DEFAULT_LIMIT);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);

    const { data, isLoading } = useGetBookingsQuery(
        status ? { page, limit, status } : undefined,
        { skip: !status }
    );

    const result = useMemo(() => data?.data?.result ?? [], [data?.data?.result]);
    const meta = data?.data?.meta;
    const detailsList = useMemo(() => result.map(mapResultToDetails), [result]);

    const handleViewDetails = (booking: BookingDetails) => {
        setSelectedBooking(booking);
        setDetailsOpen(true);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <SmallPageInfo
                title="Booking Management"
                description="Manage your bookings"
            />
            {!status ? (
                <p className="text-sm text-muted-foreground">
                    Select a section from the sidebar (Upcoming, Ongoing, Completed, or Declined).
                </p>
            ) : isLoading ? (
                <div className="flex items-center justify-center rounded-xl border bg-card py-12">
                    <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : detailsList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookings in this section.</p>
            ) : (
                <>
                    <div className="space-y-3">
                        {detailsList.map((booking) => (
                            <BookingListCard
                                key={booking.bookingId}
                                bookingId={booking.bookingId}
                                statusType={booking.statusType}
                                paymentStatus={booking.paymentStatus}
                                userName={booking.userName}
                                timeRange={booking.timeRange}
                                location={booking.parkingSpaceName}
                                date={booking.date}
                                amount={booking.amount}
                                onViewDetails={() => handleViewDetails(booking)}
                            />
                        ))}
                    </div>
                    {meta && meta.totalPage > 0 && (
                        <Pagination
                            page={meta.page}
                            totalPage={meta.totalPage}
                            total={meta.total}
                            limit={meta.limit}
                            onPageChange={setPage}
                            onLimitChange={handleLimitChange}
                            showSummary
                        />
                    )}
                </>
            )}
            <BookingViewDetails
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                booking={selectedBooking}
            />
        </div>
    );
}

export default BookingManagementLayout;
