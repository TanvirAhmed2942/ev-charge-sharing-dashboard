import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import Stats, { type StatItem } from "@/components/dashboard/overview/stats";
import BookingTrendsBarchart, {
    type BookingTrendsDataPoint,
} from "@/components/dashboard/overview/BookingTrendsBarchart";
import RevenueTrendsBarchart, {
    type RevenueTrendsDataPoint,
} from "@/components/dashboard/overview/RevenueTrendsBarchart";
import ParkingSpaces, {
    type ParkingSpaceItem,
} from "@/components/dashboard/overview/ParkingSpaces";
import AlertsAndNotifications from "@/components/dashboard/notification/AlertsAndNotifications";
import { Users, CircleParking, Euro, BookOpen } from "lucide-react";

const overviewStats: StatItem[] = [
    { label: "Total Users", value: "1.5K", icon: <Users /> },
    { label: "Total Parking Spaces", value: "1.5K", icon: <CircleParking /> },
    { label: "Total Revenue", value: "1.5K", icon: <Euro /> },
    { label: "Total Bookings", value: "1.5K", icon: <BookOpen /> },
];

const bookingTrendsData: BookingTrendsDataPoint[] = [
    { day: "Mon", bookings: 45 },
    { day: "Tue", bookings: 52 },
    { day: "Wed", bookings: 38 },
    { day: "Thu", bookings: 65 },
    { day: "Fri", bookings: 72 },
    { day: "Sat", bookings: 87 },
    { day: "Sun", bookings: 78 },
];

const revenueTrendsData: RevenueTrendsDataPoint[] = [
    { day: "Mon", revenue: 1700 },
    { day: "Tue", revenue: 2100 },
    { day: "Wed", revenue: 1600 },
    { day: "Thu", revenue: 2400 },
    { day: "Fri", revenue: 2800 },
    { day: "Sat", revenue: 3100 },
    { day: "Sun", revenue: 2600 },
];

const topParkingSpaces: ParkingSpaceItem[] = [
    { rank: 1, name: "City Center EV", bookings: 342, revenue: "€20,520", progress: 95, progressColor: "blue" },
    { rank: 2, name: "Downtown Hub", bookings: 298, revenue: "€14,900", progress: 75, progressColor: "purple" },
    { rank: 5, name: "Gulshan Station", bookings: 145, revenue: "€7,250", progress: 33, progressColor: "orange" },
];

function OverviewLayout() {
    return (
        <div className="space-y-6">
            <SmallPageInfo
                title="Admin Overview Dashboard"
                description="Real-time insights into users, bookings, parking spaces, and revenue performance."
            />
            <Stats items={overviewStats} />
            <div className="grid gap-4 md:grid-cols-2">
                <BookingTrendsBarchart data={bookingTrendsData} />
                <RevenueTrendsBarchart data={revenueTrendsData} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <ParkingSpaces items={topParkingSpaces} />
                <AlertsAndNotifications />
            </div>
        </div>
    );
}

export default OverviewLayout;
