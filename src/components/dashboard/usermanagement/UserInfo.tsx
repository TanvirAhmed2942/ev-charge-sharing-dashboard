"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Car, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUrl } from "@/hooks/useImageUrl";
import { useGetUserByIdQuery } from "@/store/Apis/usersApi/usersApi";
import type { UserByIdData } from "@/store/Apis/usersApi/usersApi";
import { Loader } from "lucide-react";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";

export type EVOwnerInfoUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  joinedOn: string;
  status: "active" | "inactive" | "blocked";
  phone?: string;
  totalBookings?: number;
  totalPayments?: string;
  lastLogin?: string;
};

type UserInfoProps = (
  | { userId: string; user?: never }
  | { userId?: never; user: EVOwnerInfoUser }
) & {
  onBlock?: (userId: string) => void;
  onUnblock?: (userId: string) => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatJoinedOn(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return createdAt;
  }
}

function UserInfoByData({
  data,
  onBlock,
  onUnblock,
}: {
  data: UserByIdData;
  onBlock?: (userId: string) => void;
  onUnblock?: (userId: string) => void;
}) {
  const avatarUrl = useImageUrl(data.profile ?? "");
  const joinedOn = formatJoinedOn(data.createdAt);
  const status = data.isActive ? "active" : "blocked";
  const totalBookings = data.totalBooking ?? 0;
  const totalParkingSpace = data.totalParkingSpace ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 rounded-full bg-emerald-600">
          <AvatarImage src={avatarUrl || undefined} alt={data.fullName} />
          <AvatarFallback className="rounded-full bg-emerald-600 text-xl font-bold text-white">
            {getInitials(data.fullName)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-3 text-lg font-bold text-foreground">{data.fullName}</h2>
        <p className="text-sm text-muted-foreground">{data.email}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
            {data.role}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              status === "active" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
              status === "blocked" &&
              "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            )}
          >
            {status}
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">
          Contact Information
        </h3>
        <Card className="rounded-lg border">
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{data.email}</span>
            </div>
            {data.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{data.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Joined {joinedOn}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">
          Activity Overview
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-lg border-0 bg-sky-50 dark:bg-sky-950/30">
            <CardContent className="flex flex-col items-start gap-1 pt-4">
              <Car className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <p className="text-xs text-sky-700 dark:text-sky-300">
                Total Bookings
              </p>
              <p className="text-lg font-bold text-sky-800 dark:text-sky-200">
                {totalBookings}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-lg border-0 bg-emerald-50 dark:bg-emerald-950/30">
            <CardContent className="flex flex-col items-start gap-1 pt-4">
              <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Parking Spaces
              </p>
              <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                {totalParkingSpace}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-2">
        {data.isActive ? (
          <Button
            variant="outline"
            className="w-full border-red-200 bg-red-50 font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            onClick={() => onBlock?.(data._id)}
          >
            Suspend Account
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-emerald-200 bg-emerald-50 font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
            onClick={() => onUnblock?.(data._id)}
          >
            Activate Account
          </Button>
        )}
      </div>
    </div>
  );
}

export default function UserInfo(props: UserInfoProps) {
  const { data, isLoading, error } = useGetUserByIdQuery(props.userId ?? "", {
    skip: !props.userId,
  });
  const avatarUrlFromUser = useImageUrl(props.user?.avatar ?? "");

  if (props.user) {
    const u = props.user;
    const phone = u.phone ?? "—";
    const totalBookings = u.totalBookings ?? 0;
    const totalPayments = u.totalPayments ?? "—";
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 rounded-full bg-emerald-600">
            <AvatarImage src={avatarUrlFromUser || undefined} alt={u.name} />
            <AvatarFallback className="rounded-full bg-emerald-600 text-xl font-bold text-white">
              {getInitials(u.name)}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-3 text-lg font-bold text-foreground">{u.name}</h2>
          <p className="text-sm text-muted-foreground">{u.email}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
              {u.role}
            </span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                u.status === "active" &&
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
                u.status === "blocked" &&
                "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
              )}
            >
              {u.status}
            </span>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">
            Contact Information
          </h3>
          <Card className="rounded-lg border">
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{u.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>Joined {u.joinedOn}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-bold text-foreground">
            Activity Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-lg border-0 bg-sky-50 dark:bg-sky-950/30">
              <CardContent className="flex flex-col items-start gap-1 pt-4">
                <Car className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <p className="text-xs text-sky-700 dark:text-sky-300">
                  Total Bookings
                </p>
                <p className="text-lg font-bold text-sky-800 dark:text-sky-200">
                  {totalBookings}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-0 bg-emerald-50 dark:bg-emerald-950/30">
              <CardContent className="flex flex-col items-start gap-1 pt-4">
                <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Total Payments
                </p>
                <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                  {totalPayments}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-2">
          {u.status === "blocked" ? (
            <Button
              variant="outline"
              className="w-full border-emerald-200 bg-emerald-50 font-semibold text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
              onClick={() => props.onUnblock?.(u.id)}
            >
              Activate Account
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full border-red-200 bg-red-50 font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
              onClick={() => props.onBlock?.(u.id)}
            >
              Suspend Account
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-border bg-muted/50 font-medium text-foreground hover:bg-muted"
          >
            Delete User
          </Button>
        </div>
      </div>
    );
  }

  if (!props.userId) return null;

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <p className="text-sm text-destructive">
        {getApiErrorMessage(error as RtkQueryError)}
      </p>
    );

  if (!data?.data) return null;

  return (
    <UserInfoByData
      data={data.data}
      onBlock={props.onBlock}
      onUnblock={props.onUnblock}
    />
  );
}
