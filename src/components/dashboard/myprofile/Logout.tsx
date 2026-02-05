"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import useToast from "@/hooks/useToast";

export default function Logout() {
    const { success, error } = useToast();
    return (
        <Card className="rounded-xl border-2 border-red-100 bg-card p-0">
            <CardContent className="flex flex-col items-stretch gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground">Logout</h3>
                    <p className="text-sm text-muted-foreground">
                        Sign out from your admin account
                    </p>
                </div>
                <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                        success("Logged out successfully");
                        error("Failed to logout");
                    }}
                    className="flex shrink-0 items-center gap-2 bg-red-500 hover:bg-red-600 sm:ml-auto"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </CardContent>
        </Card>
    );
}
