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
import type { NotificationItem } from "@/store/Apis/notificationApi/notificatioAnpi";
import { cn } from "@/lib/utils";

export type { NotificationItem };

const typeAccent: Record<string, string> = {
  success: "border-l-emerald-500",
  error: "border-l-destructive",
  warning: "border-l-amber-500",
  info: "border-l-sky-500",
};

type AllNotificationsProps = {
  notifications?: NotificationItem[];
  isLoading?: boolean;
  meta?: { page?: number; limit?: number; total?: number; totalPage?: number };
  page?: number;
  setPage: (page: number) => void;
  onMarkAllAsRead?: () => void | Promise<void>;
  onMarkAsRead?: (id: string) => void | Promise<void>;
  isMarkingAllRead?: boolean;
  markingId?: string | null;
  markAllDisabled?: boolean;
};

function AllNotifications({
  notifications = [],
  isLoading = false,
  meta = {},
  page = 1,
  setPage,
  onMarkAllAsRead,
  onMarkAsRead,
  isMarkingAllRead = false,
  markingId = null,
  markAllDisabled = false,
}: AllNotificationsProps) {
  const totalPages = Math.max(meta?.totalPage ?? 1, 1);

  const list = notifications;

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
      <Card className="min-h-[calc(100vh-11.5rem)] bg-transparent">
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
    <Card className="min-h-[calc(100vh-11.5rem)] bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbBellRinging2 size={20} />
          All Notifications
        </CardTitle>
        <CardAction>
          <Button
            type="button"
            disabled={
              markAllDisabled || list.length === 0 || isMarkingAllRead || !onMarkAllAsRead
            }
            onClick={() => void onMarkAllAsRead?.()}
          >
            {isMarkingAllRead ? "Updating…" : "Mark all as read"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.length > 0 ? (
          <>
            {list.map((notification) => {
              const accent =
                typeAccent[notification.type] ?? "border-l-emerald-500";
              return (
                <div
                  key={notification._id}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-lg border bg-white p-2 md:items-center",
                    !notification.isRead && `border-l-4 ${accent}`,
                  )}
                >
                  <div className="flex items-start gap-2">
                    <HiOutlineBell size={20} className="mt-1 shrink-0" />
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {notification.role ? (
                          <span className="text-muted-foreground">
                            · {notification.role}
                          </span>
                        ) : null}
                        {notification.status ? (
                          <span className="capitalize text-muted-foreground">
                            · {notification.status}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {!notification.isRead && onMarkAsRead ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 bg-white"
                      disabled={markingId === notification._id}
                      onClick={() => void onMarkAsRead(notification._id)}
                    >
                      {markingId === notification._id ? "…" : "Mark as read"}
                    </Button>
                  ) : null}
                </div>
              );
            })}

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  Previous
                </Button>

                {getPageNumbers().map((pageNum, index) =>
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
                      type="button"
                      onClick={() =>
                        typeof pageNum === "number" && handlePageClick(pageNum)
                      }
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="sm"
                  type="button"
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
