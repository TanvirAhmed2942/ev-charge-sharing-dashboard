import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { TbBellRinging2 } from "react-icons/tb";
import { HiOutlineBell } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import formatTimeAgo from "@/utils/xtimesAgo";

export type NotificationItem = {
  _id?: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
};

type AllNotificationsProps = {
  notifications?: NotificationItem[] | { result?: NotificationItem[] };
  isLoading?: boolean;
  meta?: { page?: number; limit?: number; total?: number; totalPage?: number };
  page?: number;
  setPage: (page: number) => void;
  userRole?: string;
};

function AllNotifications({
  notifications = [],
  isLoading = false,
  meta = {},
  page = 1,
  setPage,
  userRole,
}: AllNotificationsProps) {
  const totalPages = meta?.totalPage || 1;

  const list: NotificationItem[] = Array.isArray(notifications)
    ? notifications
    : (notifications?.result ?? []);

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <Card className="bg-transparent min-h-[calc(100vh-11.5rem)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TbBellRinging2 size={20} />
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading notifications...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent min-h-[calc(100vh-11.5rem)] ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbBellRinging2 size={20} />
          All Notifications
        </CardTitle>
        <CardAction>
          <Button className="" disabled>
            Mark all as read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.length > 0 ? (
          <>
            {list.map((notification: NotificationItem) => (
              <div
                key={notification?._id}
                className={`flex items-start md:items-center justify-between gap-2 border bg-white p-2 rounded-lg ${!notification?.isRead ? "border-l-4 border-l-emerald-500" : ""
                  }`}
              >
                <div className="flex items-start gap-2">
                  <HiOutlineBell size={20} className="mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {notification?.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(notification?.createdAt ?? "")}
                    </p>
                  </div>
                </div>

                {!notification?.isRead &&
                  userRole !== "admin" &&
                  userRole !== "super_admin" && (
                    <Button variant="outline" className="bg-white" disabled>
                      Mark as read
                    </Button>
                  )}
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                {getPageNumbers().map((pageNum: number | string, index: number) =>
                  pageNum === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => typeof pageNum === "number" && handlePageClick(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AllNotifications;
