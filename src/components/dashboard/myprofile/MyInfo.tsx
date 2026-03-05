"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Loader, Upload } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice/userSlice";
import { useUpdateProfileMutation } from "@/store/Apis/profileApi/profileApi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import { useGetProfileQuery } from "@/store/Apis/profileApi/profileApi";
import { useImageUrl } from "@/hooks/useImageUrl";

/** Only fullName, phone, and profile (file) are sent. Email is not updatable. */
type MyInfoFormData = {
    fullName: string;
    phone: string;
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function MyInfo() {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const user = useSelector(selectUser);
    const { data: profileData } = useGetProfileQuery();
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const profile = profileData?.data;
    const fullNameDefault = (user?.name ?? profile?.fullName ?? "").trim();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<MyInfoFormData>({
        defaultValues: {
            fullName: fullNameDefault,
            phone: user?.phone ?? profile?.phone ?? "",
        },
    });


    // Sync form when user or profile data loads/updates
    useEffect(() => {
        reset({
            fullName: (user?.name ?? profile?.fullName ?? "").trim(),
            phone: user?.phone ?? profile?.phone ?? "",
        });
    }, [user?.name, user?.phone, profile?.fullName, profile?.phone, reset]);

    const displayEmail = user?.email ?? profile?.email ?? "";
    const fullNameForAvatar = (user?.name ?? profile?.fullName ?? "").trim();
    const nameParts = fullNameForAvatar ? fullNameForAvatar.split(/\s+/) : [];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    const avatarSrc = previewUrl ?? user?.profile ?? profile?.profile ?? "";
    const imageUrl = useImageUrl(avatarSrc);
    console.log(imageUrl);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error("Please choose a JPG, PNG or GIF image.");
            return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            toast.error(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(file));
        setProfileFile(file);
    };

    const onSubmit = async (data: MyInfoFormData) => {
        const res = await updateProfile({
            fullName: data.fullName.trim(),
            phone: data.phone,
            ...(profileFile && { profileFile }),
        });
        if (res.error) {
            toast.error(getApiErrorMessage(res.error as RtkQueryError));
            return;
        }
        if (res.data?.success) {
            toast.success("Profile updated successfully");
            setProfileFile(null);
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        } else {
            toast.error("Failed to update profile");
        }
    };

    return (
        <Card className="rounded-xl border bg-card shadow-sm px-0">
            <CardHeader className="flex flex-row items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                    Profile Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Avatar section */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                    <Avatar className="h-20 w-20 rounded-full bg-emerald-600">
                        <AvatarImage src={imageUrl || undefined} alt="Profile" />
                        <AvatarFallback className="rounded-full bg-emerald-600 text-lg font-bold text-white">
                            {firstName?.charAt(0)}
                            {lastName?.charAt(0) || firstName?.charAt(1)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            className="hidden"
                            aria-label="Upload profile image"
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="bg-sky-500 hover:bg-sky-600"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {profileFile ? "Change image" : "Change Avatar"}
                        </Button>
                        {profileFile && (
                            <p className="text-xs text-muted-foreground">
                                {profileFile.name} — click Save Profile to upload
                            </p>
                        )}
                        {!profileFile && (
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG or GIF. Max 2MB
                            </p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            placeholder="Your full name"
                            className={`rounded-md ${errors.fullName ? "border-destructive" : ""}`}
                            {...register("fullName", {
                                required: "Full name is required",
                            })}
                        />
                        {errors.fullName && (
                            <p className="text-sm text-destructive">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={displayEmail}
                                readOnly
                                className="pl-10 rounded-md bg-muted"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Phone number"
                            className={`rounded-md ${errors.phone ? "border-destructive" : ""}`}
                            {...register("phone", {
                                required: "Phone is required",
                            })}
                        />
                        {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-sky-500 hover:bg-sky-600"
                    >
                        {isLoading ? (
                            <>
                                Saving... <Loader className="inline h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Save Profile"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
