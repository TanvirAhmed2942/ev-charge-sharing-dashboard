"use client";

import { useState, useMemo } from "react";
import ParkingCard from "@/components/common/parkingcard/ParkingCard";
import ViewDetails, {
  type ParkingSpaceDetails,
} from "@/components/dashboard/parking-management/ViewDetails";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { usePathname } from "next/navigation";
import {
  useGetParkingSpacesQuery,
  useUpdateParkingSpaceMutation,
} from "@/store/Apis/parkingApi/parkingApi";
import type { ParkingPlaceItem } from "@/store/Apis/parkingApi/parkingApi";
import type { ParkingStatus } from "@/components/common/parkingcard/ParkingCard";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import DeleteConfirmationModal from "@/components/common/deleteconfirmation/deleteConfirmationModal";
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
    id: item._id,
    title: item.name,
    address: item.locationAddress,
    status: apiStatusToUiStatus(item.status),
    availability: item.isActive ? "24/7" : "—",
    pricePerHour: `€${item.price}`,
    pricePerDay: `€${item.price}`,
    ownerName: item.userId?.fullName,
    ownerEmail: item.userId?.email,
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const toast = useToast();
  const [updateParkingSpace, { isLoading: isUpdating }] = useUpdateParkingSpaceMutation();

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

  const runApprove = async () => {
    if (!selectedParking?.id) return;
    const res = await updateParkingSpace({
      _id: selectedParking.id,
      status: "approved",
    });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError) ?? "Failed to approve");
      return;
    }
    toast.success("Parking place approved.");
    setConfirmOpen(false);
    setConfirmAction(null);
    setDetailsOpen(false);
    setSelectedParking(null);
  };

  const runReject = async () => {
    if (!selectedParking?.id) return;
    const res = await updateParkingSpace({
      _id: selectedParking.id,
      status: "rejected",
    });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError) ?? "Failed to reject");
      return;
    }
    toast.success("Parking place rejected.");
    setConfirmOpen(false);
    setConfirmAction(null);
    setDetailsOpen(false);
    setSelectedParking(null);
  };

  const handleConfirmSubmit = async () => {
    if (confirmAction === "approve") await runApprove();
    else if (confirmAction === "reject") await runReject();
  };

  const handleApprove = () => {
    setConfirmAction("approve");
    setConfirmOpen(true);
  };

  const handleReject = () => {
    setConfirmAction("reject");
    setConfirmOpen(true);
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
              onApprove={
                showApproveReject
                  ? () => {
                      setSelectedParking(parking);
                      setConfirmAction("approve");
                      setConfirmOpen(true);
                    }
                  : undefined
              }
              onReject={
                showApproveReject
                  ? () => {
                      setSelectedParking(parking);
                      setConfirmAction("reject");
                      setConfirmOpen(true);
                    }
                  : undefined
              }
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
      />
      <DeleteConfirmationModal
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setConfirmAction(null);
        }}
        onConfirm={handleConfirmSubmit}
        title={confirmAction === "approve" ? "Approve parking place?" : "Reject parking place?"}
        description={
          confirmAction === "approve"
            ? "This listing will be approved and visible to users."
            : "This listing will be rejected and removed from active listings."
        }
        confirmText={confirmAction === "approve" ? "Approve" : "Reject"}
        loadingText={confirmAction === "approve" ? "Approving..." : "Rejecting..."}
        cancelText="Cancel"
        isLoading={isUpdating}
        confirmVariant={confirmAction === "approve" ? "default" : "destructive"}
      />
    </div>
  );
}

export default ParkingManagementLayout;
