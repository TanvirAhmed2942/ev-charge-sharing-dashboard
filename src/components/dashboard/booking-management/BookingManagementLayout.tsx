"use client";

import { useState } from "react";
import BookingListCard from "@/components/common/bookinglist/BookingListCard";
import BookingViewDetails, {
    type BookingDetails,
} from "@/components/dashboard/booking-management/BookingViewDetails";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { usePathname } from "next/navigation";


const timeLine = [
    {
        title: "Booking Created",
        description: "Booking created successfully",
        date: "February 5, 2025",
        time: "09:00 AM",
    },
    {
        title: "Payment Received",
        description: "Payment received successfully",
        date: "February 5, 2025",
        time: "09:00 AM",
    },
    {
        title: "Booking Confirmed",
        description: "Booking confirmed successfully",
        date: "February 5, 2025",
        time: "09:00 AM",
    },
    {
        title: "Charging Started",
        description: "Charging started successfully",
        date: "February 5, 2025",
        time: "09:00 AM",
    },
    {
        title: "Charging Completed",
        description: "Charging completed successfully",
        date: "February 5, 2025",
        time: "09:00 AM",
    }
]
const sampleBooking: BookingDetails = {
    bookingId: "BK-2025-0001",
    statusType: "upcoming",
    paymentStatus: "paid",
    userName: "Ahmed Rahman",
    userEmail: "ahmed.r@gmail.com",
    parkingSpaceName: "City Center EV Station",
    parkingSpaceAddress: "Motijheel, Dhaka",
    date: "February 5, 2025",
    timeRange: "09:00 AM - 11:00 AM",
    duration: "2 hours",
    amount: "€120",
    timeLine: timeLine,
};


function BookingManagementLayout() {
    const pathname = usePathname();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] =
        useState<BookingDetails | null>(null);

    const handleViewDetails = (booking: BookingDetails) => {
        setSelectedBooking(booking);
        setDetailsOpen(true);
    };

    return (
        <div className="space-y-4">
            <SmallPageInfo
                title="Booking Management"
                description="Manage your bookings"
            />
            {pathname === "/dashboard/booking-management/upcoming" && (
                <BookingManagementUpcoming onViewDetails={handleViewDetails} />
            )}
            {pathname === "/dashboard/booking-management/ongoing" && (
                <BookingManagementOngoing onViewDetails={handleViewDetails} />
            )}
            {pathname === "/dashboard/booking-management/completed" && (
                <BookingManagementCompleted onViewDetails={handleViewDetails} />
            )}
            {pathname === "/dashboard/booking-management/declined" && (
                <BookingManagementDeclined onViewDetails={handleViewDetails} />
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


function BookingManagementUpcoming({
    onViewDetails,
}: {
    onViewDetails: (booking: BookingDetails) => void;
}) {
    const booking: BookingDetails = { ...sampleBooking, statusType: "upcoming", paymentStatus: "paid" };
    return (
        <div className="space-y-3">
            <BookingListCard
                bookingId={booking.bookingId}
                statusType={booking.statusType}
                paymentStatus={booking.paymentStatus}
                userName={booking.userName}
                timeRange={booking.timeRange}
                location={booking.parkingSpaceName}
                date={booking.date}
                amount={booking.amount}
                onViewDetails={() => onViewDetails(booking)}
            />
        </div>
    );
}


function BookingManagementOngoing({
    onViewDetails,
}: {
    onViewDetails: (booking: BookingDetails) => void;
}) {
    const booking: BookingDetails = { ...sampleBooking, statusType: "ongoing", paymentStatus: "paid" };
    return (
        <div className="space-y-3">
            <BookingListCard
                bookingId={booking.bookingId}
                statusType={booking.statusType}
                paymentStatus={booking.paymentStatus}
                userName={booking.userName}
                timeRange={booking.timeRange}
                location={booking.parkingSpaceName}
                date={booking.date}
                amount={booking.amount}
                onViewDetails={() => onViewDetails(booking)}
            />
        </div>
    );
}


function BookingManagementCompleted({
    onViewDetails,
}: {
    onViewDetails: (booking: BookingDetails) => void;
}) {
    const booking: BookingDetails = { ...sampleBooking, statusType: "completed", paymentStatus: "paid" };
    return (
        <div className="space-y-3">
            <BookingListCard
                bookingId={booking.bookingId}
                statusType={booking.statusType}
                paymentStatus={booking.paymentStatus}
                userName={booking.userName}
                timeRange={booking.timeRange}
                location={booking.parkingSpaceName}
                date={booking.date}
                amount={booking.amount}
                onViewDetails={() => onViewDetails(booking)}
            />
        </div>
    );
}

function BookingManagementDeclined({
    onViewDetails,
}: {
    onViewDetails: (booking: BookingDetails) => void;
}) {
    const booking: BookingDetails = { ...sampleBooking, statusType: "declined", paymentStatus: "paid" };
    return (
        <div className="space-y-3">
            <BookingListCard
                bookingId={booking.bookingId}
                statusType={booking.statusType}
                paymentStatus={booking.paymentStatus}
                userName={booking.userName}
                timeRange={booking.timeRange}
                location={booking.parkingSpaceName}
                date={booking.date}
                amount={booking.amount}
                onViewDetails={() => onViewDetails(booking)}
            />
        </div>
    );
}