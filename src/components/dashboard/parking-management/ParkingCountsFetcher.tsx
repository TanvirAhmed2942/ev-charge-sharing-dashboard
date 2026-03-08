"use client";

import { useEffect } from "react";
import { useGetParkingSpacesQuery } from "@/store/Apis/parkingApi/parkingApi";
import { useAppDispatch } from "@/store/hooks";
import { setParkingCounts } from "@/store/slices/parkingCountsSlice/parkingCountsSlice";

/**
 * Fetches parking place counts per status and stores them in Redux (parkingCounts).
 * Mount in a layout that contains the sidebar (e.g. app-sidebar).
 */
export function ParkingCountsFetcher() {
  const dispatch = useAppDispatch();
  const pending = useGetParkingSpacesQuery({ status: "pending", limit: 1 });
  const approved = useGetParkingSpacesQuery({ status: "approved", limit: 1 });
  const rejected = useGetParkingSpacesQuery({ status: "rejected", limit: 1 });

  useEffect(() => {
    if (
      pending.data?.meta != null &&
      approved.data?.meta != null &&
      rejected.data?.meta != null
    ) {
      dispatch(
        setParkingCounts({
          pending: pending.data.meta.total,
          approved: approved.data.meta.total,
          rejected: rejected.data.meta.total,
        })
      );
    }
  }, [
    dispatch,
    pending.data?.meta?.total,
    approved.data?.meta?.total,
    rejected.data?.meta?.total,
  ]);

  return null;
}
