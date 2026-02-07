"use client";

import React, { useState } from "react";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import AllNotifications, { type NotificationItem } from "./AllNotifications";

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: "1",
    message: "Your charging session at Station A has completed successfully.",
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    _id: "2",
    message: "A new EV charger is now available near your location.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    _id: "3",
    message: "Your payment of $12.50 for the last session was processed.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
  {
    _id: "4",
    message: "Reminder: You have a scheduled charging slot in 1 hour.",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
  },
  {
    _id: "5",
    message: "Welcome to EV Charge Share! Complete your profile to get started.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
  },
];

function NotificationsLayout() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const notifications = SAMPLE_NOTIFICATIONS;
  const meta = { page: 1, limit, total: 5, totalPage: 1 };

  return (
    <div className="space-y-4">
      <SmallPageInfo
        title="Notifications"
        description="Here is an overview of your notifications"
      />
      <AllNotifications
        notifications={notifications}
        userRole=""
        isLoading={false}
        meta={meta}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

export default NotificationsLayout;
