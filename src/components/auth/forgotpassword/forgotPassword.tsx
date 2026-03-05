"use client";

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
import { Loader, Mail } from "lucide-react";
import { useForgotPasswordMutation } from "@/store/Apis/authApis/authApi";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
interface ForgotPasswordFormData {
  email: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const toast = useToast();
  const router = useRouter();
  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const res = await forgotPassword({ email: data.email });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    toast.success("Email sent", {
      description: "Please check your email to reset your password",
    });
    Cookies.set("forgetToken", res.data?.data?.forgetToken || "", { expires: 1 });
    router.push("/auth/verify-email");
  };

  return (
    <Card className="w-full max-w-md backdrop-blur-md bg-card/80 border-border/50 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground font-medium">
              Enter your email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email to reset your password"
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

          <Button
            type="submit"
            disabled={isForgotPasswordLoading}
            className="w-full bg-black/70 hover:bg-black text-white hover:text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isForgotPasswordLoading ? (
              <>
                Sending... <Loader className="inline h-4 w-4 animate-spin" />
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
