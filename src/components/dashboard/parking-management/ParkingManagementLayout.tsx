"use client";

import { useState, useMemo } from "react";
import ParkingCard from "@/components/common/parkingcard/ParkingCard";
import ViewDetails, {
  type ParkingSpaceDetails,
} from "@/components/dashboard/parking-management/ViewDetails";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { usePathname } from "next/navigation";
import { useGetParkingSpacesQuery } from "@/store/Apis/parkingApi/parkingApi";
import type { ParkingPlaceItem } from "@/store/Apis/parkingApi/parkingApi";
import type { ParkingStatus } from "@/components/common/parkingcard/ParkingCard";
import { Loader } from "lucide-react";

const PATH_TO_STATUS = {
  "/dashboard/parking-management/waiting-for-approval": "pending",
  "/dashboard/parking-management/active-approved": "approved",
  "/dashboard/parking-management/inactive-rejected": "rejected",
} as const;

type PathStatus = keyof typeof PATH_TO_STATUS;

function pathnameToStatus(pathname: string): "pending" | "approved" | "rejected" | null {
  const status = PATH_TO_STATUS[pathname as PathStatus];
  return status ?? null;
}

/** Map API status to UI ParkingStatus (pending | active | rejected | inactive) */
function apiStatusToUiStatus(apiStatus: string): ParkingStatus {
  if (apiStatus === "approved") return "active";
  if (apiStatus === "rejected") return "rejected";
  if (apiStatus === "pending") return "pending";
  return "inactive";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function mapPlaceToDetails(item: ParkingPlaceItem): ParkingSpaceDetails {
  return {
    title: item.name,
    address: item.locationAddress,
    status: apiStatusToUiStatus(item.status),
    availability: item.isActive ? "24/7" : "—",
    pricePerHour: `€${item.price}`,
    pricePerDay: `€${item.price}`,
    ownerName: "—",
    submissionDate: formatDate(item.createdAt),
    images: item.images ?? [],
    mapCoordinates: `${item.latitude},${item.longitude}`,
  };
}

function ParkingManagementLayout() {
  const pathname = usePathname();
  const status = pathnameToStatus(pathname);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedParking, setSelectedParking] =
    useState<ParkingSpaceDetails | null>(null);

  const { data, isLoading } = useGetParkingSpacesQuery(
    status ? { status } : undefined,
    { skip: !status }
  );

  const places = useMemo(() => data?.data ?? [], [data?.data]);
  const detailsList = useMemo(
    () => places.map(mapPlaceToDetails),
    [places]
  );

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

  const showApproveReject =
    pathname === "/dashboard/parking-management/waiting-for-approval";

  return (
    <div className="space-y-6">
      <SmallPageInfo
        title="Parking Management"
        description="Manage your parking spaces and bookings"
      />
      {!status ? (
        <p className="text-sm text-muted-foreground">
          Select a section from the sidebar (Waiting for Approval, Active/Approved, or Inactive/Rejected).
        </p>
      ) : isLoading ? (
        <div className="flex items-center justify-center rounded-xl border bg-card py-12">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : detailsList.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No parking places in this section.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {detailsList.map((parking, index) => (
            <ParkingCard
              key={places[index]?._id ?? index}
              title={parking.title}
              address={parking.address}
              pricePerHour={parking.pricePerHour}
              pricePerDay={parking.pricePerDay ?? "—"}
              availability={parking.availability}
              ownerName={parking.ownerName ?? "—"}
              status={parking.status}
              onViewDetails={() => handleViewDetails(parking)}
              onApprove={showApproveReject ? () => {} : undefined}
              onReject={showApproveReject ? () => {} : undefined}
            />
          ))}
        </div>
      )}
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

export default ParkingManagementLayout;
