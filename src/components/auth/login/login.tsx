"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader, Lock, Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/Apis/authApis/authApi";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";

interface LoginFormData {
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await login({ email: data.email, password: data.password });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    if (res.data?.success) {
      toast.success("Login successful");
      Cookies.set("token", res.data?.data?.accessToken ?? "");
      Cookies.set("refreshToken", res.data?.data?.refreshToken ?? "");
      router.push("/dashboard/overview");
    } else {
      toast.error(res.data?.message ?? "Invalid email or password");
    }
  };

    return (
        <Card className="w-full max-w-md backdrop-blur-md bg-card/80 border-border/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                    Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Sign in to your account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-card-foreground font-medium">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className={`pl-10 bg-input/60 border-border/50 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${errors.email ? "border-destructive focus:ring-destructive/50" : ""}`}
                                {...register("email", {
                                  required: "Email is required",
                                  pattern: {
                                    value: EMAIL_REGEX,
                                    message: "Please enter a valid email address",
                                  },
                                })}
                            />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="password"
                            className="text-card-foreground font-medium"
                        >
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 " />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`pl-10 pr-10 bg-input/60 border-border/50 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${errors.password ? "border-destructive focus:ring-destructive/50" : ""}`}
                                {...register("password", {
                                  required: "Password is required",
                                  minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                  },
                                })}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-card-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                className="h-4 w-4 rounded border-border/50 bg-input/60 text-secondary "
                            />
                            <Label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground"
                            >
                                Remember me
                            </Label>
                        </div>
                        <Button
                            variant="link"
                            className="px-0 text-sm text-gray-500 hover:text-gray-600/80 cursor-pointer"
                            onClick={() => router.push("/auth/forgot-password")}
                        >
                            Forgot password?
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black/70 hover:bg-black text-white hover:text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
