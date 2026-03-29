"use client";

import React, { useState } from "react";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import AllNotifications from "./AllNotifications";
import {
  useGetNotificationQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/store/Apis/notificationApi/notificatioAnpi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
function NotificationsLayout() {
  const [page, setPage] = useState(1);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const limit = 10;
  const toast = useToast();

  const { data, isLoading, isFetching, error } = useGetNotificationQuery({
    page,
    limit,
  });

  const [markAllAsRead, { isLoading: isMarkingAll }] =
    useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = data?.data ?? [];
  const meta = data?.meta ?? {
    page,
    limit,
    total: 0,
    totalPage: 1,
  };

  const handleMarkAllAsRead = async () => {
    const res = await markAllAsRead();
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    toast.success("All notifications marked as read");
  };

  const handleMarkAsRead = async (id: string) => {
    setMarkingId(id);
    const res = await markAsRead(id);
    setMarkingId(null);
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    toast.success("Marked as read");
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="space-y-4">
      <SmallPageInfo
        title="Notifications"
        description="Here is an overview of your notifications"
      />
      {error ? (
        <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {getApiErrorMessage(error as RtkQueryError)}
        </p>
      ) : null}
      <AllNotifications
        notifications={notifications}
        isLoading={isLoading || (isFetching && !data)}
        meta={meta}
        page={page}
        setPage={setPage}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkAsRead}
        isMarkingAllRead={isMarkingAll}
        markingId={markingId}
        markAllDisabled={!hasUnread}
      />
    </div>
  );
}

export default NotificationsLayout;
