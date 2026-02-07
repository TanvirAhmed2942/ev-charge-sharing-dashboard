"use client";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ParkingStatus = "pending" | "active" | "rejected" | "inactive";

export type ParkingCardProps = {
    title: string;
    address: string;
    pricePerHour: string;
    pricePerDay: string;
    availability: string;
    ownerName: string;
    status: ParkingStatus;
    onViewDetails?: () => void;
    onApprove?: () => void;
    onReject?: () => void;
    className?: string;
};

const statusConfig: Record<
    ParkingStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className:
            "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
    },
    active: {
        label: "Active",
        className:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    },
    rejected: {
        label: "Rejected",
        className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
    },
    inactive: {
        label: "Inactive",
        className:
            "bg-muted text-muted-foreground",
    },
};

export default function ParkingCard({
    title,
    address,
    pricePerHour,
    pricePerDay,
    availability,
    ownerName,
    status,
    onViewDetails,
    onApprove,
    onReject,
    className,
}: ParkingCardProps) {
    const statusStyle = statusConfig[status];

    return (
        <Card
            className={cn(
                "overflow-hidden rounded-2xl border bg-card p-0 shadow-md",
                className
            )}
        >
            {/* Top: Google Map embed or custom image with status badge */}
            <CardHeader className="relative h-64 shrink-0 p-0">
                <div className=" h-full w-full bg-muted flex items-center justify-center">
                    {address ? (
                        <iframe
                            title={`Map: ${address}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
                            className="absolute inset-0 h-full w-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    ) : (
                        <div>
                            <p className="text-sm text-muted-foreground">No Available Map</p>
                        </div>
                    )}
                </div>
                <span
                    className={cn(
                        "absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold",
                        statusStyle.className
                    )}
                >
                    {statusStyle.label}
                </span>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 px-5 py-0">
                <CardTitle className="text-lg font-bold text-foreground">
                    {title}
                </CardTitle>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{address}</span>
                </div>

                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                        <span>Price per hour</span>
                        <span className="font-medium text-foreground">
                            {pricePerHour}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>Price per day</span>
                        <span className="font-medium text-foreground">
                            {pricePerDay}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{availability}</span>
                </div>

                <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground">Owner</p>
                    <p className="mt-0.5 font-medium text-foreground">
                        {ownerName}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="flex items-center gap-2 px-5 pt-0 pb-5 ">
                <Button
                    variant="secondary"
                    className="flex-1 bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:hover:bg-sky-900/60"
                    onClick={onViewDetails}
                >
                    View Details
                </Button>
                {onApprove && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="size-9 rounded-full bg-emerald-100 text-emerald-700 shadow-sm hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
                        onClick={onApprove}
                        aria-label="Approve"
                    >
                        <Check className="h-5 w-5" />
                    </Button>
                )}
                {onReject && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="size-9 rounded-full bg-red-100 text-red-700 shadow-sm hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60"
                        onClick={onReject}
                        aria-label="Reject"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
