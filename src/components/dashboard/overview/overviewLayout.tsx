"use client";

import { useMemo, useState } from "react";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import Stats, { type StatItem } from "@/components/dashboard/overview/stats";
import BookingTrendsBarchart, {
  type BookingTrendsDataPoint,
  type BookingPeriod,
} from "@/components/dashboard/overview/BookingTrendsBarchart";
import RevenueTrendsBarchart, {
  type RevenueTrendsDataPoint,
  type RevenuePeriod,
} from "@/components/dashboard/overview/RevenueTrendsBarchart";
import ParkingSpaces, {
  type ParkingSpaceItem,
} from "@/components/dashboard/overview/ParkingSpaces";
import AlertsAndNotifications from "@/components/dashboard/notification/AlertsAndNotifications";
import { Users, CircleParking, Euro, BookOpen, Loader } from "lucide-react";
import { useGetDashboardOverviewQuery } from "@/store/Apis/dashboardApi/dashboardApi";

const PROGRESS_COLORS: Array<"blue" | "purple" | "orange"> = [
  "blue",
  "purple",
  "orange",
];

function formatDayLabel(day: string): string {
  if (day.length <= 3) return day.charAt(0).toUpperCase() + day.slice(1);
  return day;
}

function OverviewLayout() {
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("monthly");
  const [bookingPeriod, setBookingPeriod] = useState<BookingPeriod>("weekly");

  const { data, isLoading, error } = useGetDashboardOverviewQuery({
    revenuestatus: revenuePeriod,
    bookingstatus: bookingPeriod,
  });

  const overviewStats: StatItem[] = useMemo(() => {
    const d = data?.data;
    if (!d)
      return [
        { label: "Total Users", value: "—", icon: <Users /> },
        { label: "Total Parking Spaces", value: "—", icon: <CircleParking /> },
        { label: "Total Revenue", value: "—", icon: <Euro /> },
        { label: "Total Bookings", value: "—", icon: <BookOpen /> },
      ];
    return [
      { label: "Total Users", value: d.totalUsers ?? 0, icon: <Users /> },
      {
        label: "Total Parking Spaces",
        value: d.totalParkingPlace ?? 0,
        icon: <CircleParking />,
      },
      {
        label: "Total Revenue",
        value: `€${Number(d.totalRevenue ?? 0).toFixed(2)}`,
        icon: <Euro />,
      },
      {
        label: "Total Bookings",
        value: d.totalBooking ?? 0,
        icon: <BookOpen />,
      },
    ];
  }, [data?.data]);

  const bookingTrendsData: BookingTrendsDataPoint[] = useMemo(() => {
    const list = data?.data?.weeklyMonthlyBookingData ?? [];
    return list.map((item) => ({
      day: formatDayLabel(item.day),
      bookings: item.amount ?? 0,
    }));
  }, [data?.data?.weeklyMonthlyBookingData]);

  const revenueTrendsData: RevenueTrendsDataPoint[] = useMemo(() => {
    const list = data?.data?.weeklyMonthlyData ?? [];
    return list.map((item) => ({
      day: item.day,
      revenue: item.amount ?? 0,
    }));
  }, [data?.data?.weeklyMonthlyData]);

  const topParkingSpaces: ParkingSpaceItem[] = useMemo(() => {
    const list = data?.data?.topParkingPlace ?? [];
    const maxBookings = Math.max(
      ...list.map((p) => p.totalBookings),
      1
    );
    return list.map((item, index) => ({
      rank: index + 1,
      name: item.parkingName ?? "—",
      bookings: item.totalBookings ?? 0,
      revenue: `€${item.totalAmount ?? 0}`,
      progress: Math.round((item.totalBookings / maxBookings) * 100),
      progressColor: PROGRESS_COLORS[index % PROGRESS_COLORS.length],
    }));
  }, [data?.data?.topParkingPlace]);

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load dashboard overview. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SmallPageInfo
        title="Admin Overview Dashboard"
        description="Real-time insights into users, bookings, parking spaces, and revenue performance."
      />
      <Stats items={overviewStats} />
      <div className="grid gap-4 md:grid-cols-2">
        <BookingTrendsBarchart
          data={bookingTrendsData}
          period={bookingPeriod}
          onPeriodChange={setBookingPeriod}
        />
        <RevenueTrendsBarchart
          data={revenueTrendsData}
          period={revenuePeriod}
          onPeriodChange={setRevenuePeriod}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ParkingSpaces items={topParkingSpaces} />
        <AlertsAndNotifications />
      </div>
    </div>
  );
}

export default OverviewLayout;
