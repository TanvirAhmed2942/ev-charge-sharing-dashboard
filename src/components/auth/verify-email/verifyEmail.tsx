"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useToast from "@/hooks/useToast";
import { Loader } from "lucide-react";
import {
  useResendCreateUserOtpMutation,
  useVerifyEmailMutation,
} from "@/store/Apis/authApis/authApi";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import { useRouter } from "next/navigation";
interface VerifyEmailFormData {
  otp: string;
}

export default function VerifyEmail() {
  const toast = useToast();
  const router = useRouter();
  const [verifyEmail, { isLoading: isVerifyEmailLoading }] =
    useVerifyEmailMutation();
  const [resendCreateUserOtp, { isLoading: isResendOtpLoading }] =
    useResendCreateUserOtpMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    const res = await verifyEmail({ otp: data.otp });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    toast.success("OTP verified successfully");
    router.push("/auth/reset-password");
  };

  const handleResendOtp = async () => {

    const res = await resendCreateUserOtp();
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    toast.success("OTP resent successfully");
    router.push("/auth/verify-email");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md backdrop-blur-md bg-card/80 border-border/50 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-card-foreground">
          Verify Email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the 6-digit code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 flex flex-col items-center justify-center">
            <Controller
              name="otp"
              control={control}
              rules={{
                required: "Enter the 6-digit code",
                minLength: {
                  value: 6,
                  message: "Code must be 6 digits",
                },
                pattern: {
                  value: /^\d{6}$/,
                  message: "Code must be 6 digits",
                },
              }}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="text-black font-bold cursor-pointer hover:underline flex items-center gap-2 bg-transparent border-none p-0"
              onClick={handleResendOtp}
              disabled={isResendOtpLoading}
            >
              {isResendOtpLoading ? (
                <>
                  Resending... <Loader className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Resend"
              )}
            </button>
          </p>
          <Button
            type="submit"
            disabled={isVerifyEmailLoading}
            className="w-full bg-black/70 hover:bg-black text-white hover:text-white font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifyEmailLoading ? (
              <>
                Verifying... <Loader className="inline h-4 w-4 animate-spin" />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
