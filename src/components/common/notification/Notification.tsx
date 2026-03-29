"use client";

import { Button } from "@/components/ui/button";
import { socketForNewNotification } from "@/socket/socket";
import { selectUser } from "@/store/slices/userSlice/userSlice";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Notification() {
  const [notificationCount, setNotificationCount] = useState(0);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    const userId = user?._id;
    console.log("userId", userId);
    if (!userId) return;

    const cleanup = socketForNewNotification(userId, () => {
      setNotificationCount((c) => c + 1);
    });
    return cleanup;
  }, [user._id]);

  const badgeText =
    notificationCount > 99 ? "99+" : String(notificationCount);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full hover:bg-muted"
        type="button"
        aria-label={
          notificationCount > 0
            ? `${notificationCount} unread notifications`
            : "Notifications"
        }
      >
        <Bell className="size-4" />
        {notificationCount > 0 ? (
          <span
            className={cn(
              "absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-destructive p-1 text-[12px] font-semibold leading-none text-destructive-foreground"
            )}
          >
            {badgeText}
          </span>
        ) : null}
      </Button>
    </div>
  );
}
