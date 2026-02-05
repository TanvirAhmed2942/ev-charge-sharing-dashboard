"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Car, DollarSign, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserTableUser } from "@/components/common/usertable/UserTable";

export type ParkingSpaceOwnerInfoUser = UserTableUser & {
  phone?: string;
};

type ParkingSpaceOwnerInfoProps = {
  user: ParkingSpaceOwnerInfoUser;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ParkingSpaceOwnerInfo({ user }: ParkingSpaceOwnerInfoProps) {
  const phone = user.phone ?? "+880 1712-345678";

  return (
    <div className="space-y-6">
      {/* User header */}
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 rounded-full bg-emerald-600">
          <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
          <AvatarFallback className="rounded-full bg-emerald-600 text-xl font-bold text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-3 text-lg font-bold text-foreground">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-900/50 dark:text-sky-300">
            {user.role}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              user.status === "active" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
              user.status === "inactive" && "bg-muted text-muted-foreground",
              user.status === "blocked" &&
              "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
            )}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-foreground">
          Contact Information
        </h3>
        <Card className="rounded-lg border">
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Joined {user.joinedOn}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
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
                0
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-lg border-0 bg-emerald-50 dark:bg-emerald-950/30">
            <CardContent className="flex flex-col items-start gap-1 pt-4">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                Total Payments
              </p>
              <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                0
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-3 rounded-lg border">
          <CardContent className="flex items-center gap-3 py-4">
            <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Last Login</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full border-red-200 bg-red-50 font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          Suspend Account
        </Button>
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
