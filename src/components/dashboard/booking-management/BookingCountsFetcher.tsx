"use client";

import { useEffect } from "react";
import { useGetBookingsQuery } from "@/store/Apis/bookingApi/bookingApi";
import { useAppDispatch } from "@/store/hooks";
import { setBookingCounts } from "@/store/slices/bookingCountsSlice/bookingCountsSlice";

/**
 * Fetches booking counts for each status and stores them in Redux (bookingCounts).
 * Mount this in a layout that contains the sidebar (e.g. dashboard layout or sidebar).
 */
export function BookingCountsFetcher() {
  const dispatch = useAppDispatch();
  const pending = useGetBookingsQuery({ status: "pending", page: 1, limit: 1 });
  const accept = useGetBookingsQuery({ status: "accept", page: 1, limit: 1 });
  const complete = useGetBookingsQuery({ status: "complete", page: 1, limit: 1 });
  const cancel = useGetBookingsQuery({ status: "cancel", page: 1, limit: 1 });

  useEffect(() => {
    if (
      pending.data?.data?.meta != null &&
      accept.data?.data?.meta != null &&
      complete.data?.data?.meta != null &&
      cancel.data?.data?.meta != null
    ) {
      dispatch(
        setBookingCounts({
          upcoming: pending.data.data.meta.total,
          ongoing: accept.data.data.meta.total,
          completed: complete.data.data.meta.total,
          declined: cancel.data.data.meta.total,
        })
      );
    }
  }, [
    dispatch,
    pending.data?.data?.meta?.total,
    accept.data?.data?.meta?.total,
    complete.data?.data?.meta?.total,
    cancel.data?.data?.meta?.total,
  ]);

  return null;
}
