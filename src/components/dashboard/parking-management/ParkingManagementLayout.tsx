"use client";

import { useState } from "react";
import ParkingCard from "@/components/common/parkingcard/ParkingCard";
import ViewDetails, {
    type ParkingSpaceDetails,
} from "@/components/dashboard/parking-management/ViewDetails";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { usePathname } from "next/navigation";

const sampleParking: ParkingSpaceDetails = {
    title: "Downtown Parking Hub",
    address: "123 Business Bay, New York, NY",
    status: "pending",
    availability: "24/7",
    pricePerHour: "€50",
    pricePerDay: "€40",
    ownerName: "Fatima Khan",
    ownerEmail: "fatima.k@yahoo.com",
    ownerPhone: "1234567890",
    ownerAddress: "123 Business Bay, New York, NY",
    submissionDate: "January 30, 2025",
    mapCoordinates: "23.7808, 90.4176",
    images: ['/parking/parking_lot_1.jpg', '/parking/parking_lot_2.jpg'],
};

function ParkingManagementLayout() {
    const pathname = usePathname();
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedParking, setSelectedParking] =
        useState<ParkingSpaceDetails | null>(null);

    const handleViewDetails = (parking: ParkingSpaceDetails) => {
        setSelectedParking(parking);
        setDetailsOpen(true);
    };

    const handleApprove = () => {
        // TODO: e.g. API call to approve selectedParking
    };

    const handleReject = () => {
        // TODO: e.g. API call to reject selectedParking
    };

    const handleDisable = () => {
        // TODO: e.g. API call to disable selectedParking temporarily
    };

    return (
        <div className="space-y-6">
            <SmallPageInfo
                title="Parking Management"
                description="Manage your parking spaces and bookings"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {pathname === "/dashboard/parking-management/waiting-for-approval" && (
                    <ParkingManagementWaitingForApproval onViewDetails={handleViewDetails} />
                )}
                {pathname === "/dashboard/parking-management/active-approved" && (
                    <ParkingManagementActiveApproved onViewDetails={handleViewDetails} />
                )}
                {pathname === "/dashboard/parking-management/inactive-rejected" && (
                    <ParkingManagementInactiveRejected onViewDetails={handleViewDetails} />
                )}
            </div>
            <ViewDetails
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                parking={selectedParking}
                onApprove={handleApprove}
                onReject={handleReject}
                onDisable={handleDisable}
            />
        </div>
    );
}

export default ParkingManagementLayout


function ParkingManagementWaitingForApproval({
    onViewDetails,
}: {
    onViewDetails: (parking: ParkingSpaceDetails) => void;
}) {
    const parking: ParkingSpaceDetails = {
        ...sampleParking,
        status: "pending",
    };
    return (
        <ParkingCard
            title={parking.title}
            address={parking.address}
            pricePerHour={parking.pricePerHour}
            pricePerDay={parking.pricePerDay ?? "€40"}
            availability={parking.availability}
            ownerName={parking.ownerName ?? "John Doe"}
            status="pending"
            onViewDetails={() => onViewDetails(parking)}
            onApprove={() => { }}
            onReject={() => { }}
        />
    );
}



function ParkingManagementActiveApproved({
    onViewDetails,
}: {
    onViewDetails: (parking: ParkingSpaceDetails) => void;
}) {
    const parking: ParkingSpaceDetails = {
        ...sampleParking,
        status: "active",
    };
    return (
        <ParkingCard
            title={parking.title}
            address={parking.address}
            pricePerHour={parking.pricePerHour}
            pricePerDay={parking.pricePerDay ?? "€40"}
            availability={parking.availability}
            ownerName={parking.ownerName ?? "John Doe"}
            status="active"
            onViewDetails={() => onViewDetails(parking)}
        />
    );
}

function ParkingManagementInactiveRejected({
    onViewDetails,
}: {
    onViewDetails: (parking: ParkingSpaceDetails) => void;
}) {
    const parking: ParkingSpaceDetails = {
        ...sampleParking,
        status: "inactive",
    };
    return (
        <ParkingCard
            title={parking.title}
            address={parking.address}
            pricePerHour={parking.pricePerHour}
            pricePerDay={parking.pricePerDay ?? "€40"}
            availability={parking.availability}
            ownerName={parking.ownerName ?? "John Doe"}
            status="inactive"
            onViewDetails={() => onViewDetails(parking)}
        />
    );
}