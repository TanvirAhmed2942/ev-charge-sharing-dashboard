"use client";
import { useState } from "react";
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

export default function VerifyEmail() {
  const { success, error } = useToast();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      error("Please enter a valid 6-digit OTP", {
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    success("OTP verified successfully", {
      description: "OTP verified successfully",
    });
  };

  const handleResendOtp = () => {
    success("OTP resent successfully", {
      description: "OTP resent successfully",
    });
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex flex-col items-center justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
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
          </div>
          <p className="text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
            Didn&apos;t receive the code?{" "}
            <span
              className="text-black font-bold cursor-pointer hover:underline flex items-center gap-2"
              onClick={handleResendOtp}
            >
              {isResending ? (
                <>
                  Resending...{" "}
                  <Loader className="w-4 h-4 animate-spin text-black" />
                </>
              ) : (
                "Resend"
              )}
            </span>
          </p>
          <Button
            type="submit"
            disabled={isVerifying || otp.length !== 6}
            className="w-full bg-black/70 hover:bg-black text-white hover:text-white  font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                Verifying...{" "}
                <Loader className="w-4 h-4 animate-spin text-white" />
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
