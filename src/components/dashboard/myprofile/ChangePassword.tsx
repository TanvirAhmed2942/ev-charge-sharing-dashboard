"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useChangePasswordMutation } from "@/store/Apis/authApis/authApi";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePassword = () => {
    const toast = useToast();
    const router = useRouter();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<ChangePasswordFormData>({
        mode: "onChange",
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        const res = await changePassword({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        });
        if (res.error) {
            toast.error(getApiErrorMessage(res.error as RtkQueryError));
            return;
        }
        if (res.data?.success) {
            toast.success("Password changed successfully");
            reset();
            Cookies.remove("token");
            Cookies.remove("refreshToken");
            router.push("/auth/login");
        } else {
            toast.error(res.data?.message ?? "Failed to change password");
        }
    };
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <div className="relative">
                            <Input
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Current Password"
                                {...register("oldPassword", {
                                    required: "Current password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className={`pr-10 ${errors.oldPassword ? "border-destructive" : ""}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.oldPassword?.message && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Password (min 8 characters)"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className={`pr-10 ${errors.newPassword ? "border-destructive" : ""}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.newPassword?.message && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value: string) => {
                                        const newPassword = watch("newPassword");
                                        return value === newPassword || "Passwords do not match";
                                    },
                                })}
                                className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.confirmPassword?.message && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black/70 hover:bg-black text-white hover:text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                Changing... <Loader className="inline h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ChangePassword;
