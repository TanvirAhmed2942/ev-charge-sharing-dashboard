"use client";

import { User, Mail } from "lucide-react";
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

export default function MyInfo() {
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
                        <AvatarImage src="" alt="Profile" />
                        <AvatarFallback className="rounded-full bg-emerald-600 text-lg font-bold text-white">
                            AD
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Button variant="default" size="sm" className="bg-sky-500 hover:bg-sky-600">
                            Change Avatar
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG or GIF. Max 2MB
                        </p>
                    </div>
                </div>

                {/* Form fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Admin" className="rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="User" className="rounded-md" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            defaultValue="admin@evparking.com"
                            className="pl-10 rounded-md"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        defaultValue="+31 6 12345678"
                        className="rounded-md"
                    />
                </div>

                {/* <div className="flex justify-end "> */}
                <Button className="bg-sky-500 hover:bg-sky-600 w-full">
                    Save Profile
                </Button>
                {/* </div> */}
            </CardContent>
        </Card>
    );
}
