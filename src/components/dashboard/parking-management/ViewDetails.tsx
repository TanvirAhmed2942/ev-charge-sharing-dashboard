"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, CheckCircle2, XCircle, Mail, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useImageUrl } from "@/hooks/useImageUrl";

export type ParkingStatus = "pending" | "active" | "rejected" | "inactive";

function ParkingDetailImage({ src, alt }: { src: string; alt: string }) {
    const imageUrl = useImageUrl(src);
    if (!imageUrl) return null;
    return (
        <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl">
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 576px, 672px"
                unoptimized
            />
        </div>
    );
}

export type ParkingSpaceDetails = {
    id?: string;
    title: string;
    address: string;
    status: ParkingStatus;
    availability: string;
    pricePerHour: string;
    pricePerDay?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    ownerAddress?: string;
    submissionDate?: string;
    images?: string[];
    mapCoordinates?: string;
};

type ViewDetailsProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    parking: ParkingSpaceDetails | null;
    onApprove?: () => void;
    onReject?: () => void;
};

const statusConfig: Record<
    ParkingStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
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
        className: "bg-muted text-muted-foreground",
    },
};

export default function ViewDetails({
    open,
    onOpenChange,
    parking,
    onApprove,
    onReject,
}: ViewDetailsProps) {
    if (!parking) return null;

    const statusStyle = statusConfig[parking.status];
    const images = parking.images?.length ? parking.images : [null];
    const hasSlides = images.length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[90vh] max-h-[90dvh] flex-col gap-0 p-0 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] sm:w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">
                <DialogHeader className="shrink-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
                    <DialogTitle className="text-base sm:text-lg">
                        Parking Space Details
                    </DialogTitle>
                </DialogHeader>

                {/* Image carousel - Swiper (contained, no overlap) */}
                <div
                    className="isolate shrink-0 w-full px-4 pb-3 sm:px-6 sm:pb-4"
                    style={{ aspectRatio: "16/10" }}
                >
                    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border/50 bg-muted shadow-sm ring-1 ring-black/5 sm:rounded-xl [--swiper-pagination-bottom:10px] [--swiper-pagination-bullet-size:6px] sm:[--swiper-pagination-bullet-size:8px] [--swiper-pagination-bullet-inactive-opacity:0.5] [--swiper-pagination-color:var(--color-primary)]">
                        {hasSlides && (
                            <Swiper
                                modules={[Pagination]}
                                pagination={{ clickable: true }}
                                className="h-full! w-full!"
                                spaceBetween={10}
                                slidesPerView={1}
                                loop={images.length > 1}
                            >
                                {images.map((image, i) => (
                                    <SwiperSlide
                                        key={i}
                                        className="h-full! w-full!"
                                    >
                                        {image ? (
                                            <ParkingDetailImage
                                                src={image}
                                                alt={`${parking.title} - ${i + 1}`}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-linear-to-br from-slate-200 to-slate-100 sm:rounded-xl dark:from-slate-700 dark:to-slate-800">
                                                <span className="text-sm text-muted-foreground">
                                                    No image
                                                </span>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>

                <ScrollArea className="relative z-10 min-h-0 flex-1 border-t border-border/50">
                    <div className="px-4 py-4 space-y-4 sm:px-6 sm:py-5 sm:space-y-5">
                        {/* Name, address, status */}
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="text-lg font-bold text-foreground sm:text-xl">
                                {parking.title}
                            </h3>
                            <span
                                className={cn(
                                    "rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 sm:px-3 sm:py-1",
                                    statusStyle.className
                                )}
                            >
                                {statusStyle.label}
                            </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{parking.address}</span>
                        </div>

                        {/* Location Map */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-foreground sm:text-sm">
                                Location Map
                            </h4>
                            <div className="flex aspect-2/1 w-full min-h-[120px] items-center justify-center rounded-lg border bg-muted/50 sm:min-h-[140px]">
                                {parking.mapCoordinates ? (
                                    <iframe
                                        title="Location map"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(parking.mapCoordinates.trim())}&z=16&output=embed`}
                                        className="h-full w-full rounded-lg border-0"
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-10 w-10 opacity-40" />
                                        <span className="text-sm">
                                            Map preview: 23.7808, 90.4176
                                        </span>
                                    </div>
                                )}
                            </div>
                            {parking.mapCoordinates && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Map preview: {parking.mapCoordinates}
                                </p>
                            )}
                        </div>

                        {/* Availability & Price cards */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Card className="overflow-hidden border-0 bg-violet-100 dark:bg-violet-900/30">
                                <CardContent className="flex flex-col gap-1 p-3 sm:p-4">
                                    <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        <span className="text-xs font-medium sm:text-sm">
                                            Availability Hours
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-foreground sm:text-lg">
                                        {parking.availability}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden border-0 bg-emerald-100 dark:bg-emerald-900/30">
                                <CardContent className="flex flex-col gap-1 p-3 sm:p-4">
                                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 sm:text-sm">
                                        Price per Hour
                                    </span>
                                    <p className="text-base font-bold text-emerald-800 dark:text-emerald-200 sm:text-lg">
                                        {parking.pricePerHour}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Owner Information */}
                        <div className="rounded-lg border border-border/50 bg-muted/30 p-4 sm:p-5">
                            <h4 className="text-sm font-bold text-foreground sm:text-base">
                                Owner Information
                            </h4>
                            <div className="mt-3 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4 shrink-0" />
                                    <span>{parking.ownerName ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span>{parking.ownerEmail ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 shrink-0" />
                                    <span>
                                        {parking.submissionDate
                                            ? `Submitted on ${parking.submissionDate}`
                                            : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer: varies by status */}
                {parking.status === "pending" && (
                    <footer className="shrink-0 border-t border-border/50 px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                            <Button
                                type="button"
                                onClick={() => onApprove?.()}
                                className="gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve Listing
                            </Button>
                            <Button
                                type="button"
                                onClick={() => onReject?.()}
                                className="gap-2 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject Listing
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                        </div>
                    </footer>
                )}
                {parking.status === "active" && (
                    <footer className="shrink-0 border-t border-border/50 px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                        </div>
                    </footer>
                )}
                {(parking.status === "inactive" || parking.status === "rejected") && (
                    <footer className="shrink-0 border-t border-border/50 px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => onOpenChange(false)}
                                className="rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                            >
                                Close
                            </Button>
                        </div>
                    </footer>
                )}
            </DialogContent>
        </Dialog>
    );
}
