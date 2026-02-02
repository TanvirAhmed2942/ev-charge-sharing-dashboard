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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Mail } from "lucide-react";
import useToast from "@/hooks/useToast";

export default function ForgotPassword() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    success("Email sent", {
      description: "Please check your email to reset your password",
    });
    error("Failed to send email", {
      description: "Please try again",
    });
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input/60 border-border/50 text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black/70 hover:bg-black text-white hover:text-white  font-medium py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-secondary/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <>Sending...{" "}<Loader className="w-4 h-4 animate-spin text-white" /></> : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
