"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Eye, Ban } from "lucide-react";

export type UserTableUser = {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: string;
    joinedOn: string;
    status: "active" | "inactive" | "blocked";
};

type UserTableProps = {
    users: UserTableUser[];
    onView?: (user: UserTableUser) => void;
    onBlock?: (user: UserTableUser) => void;
    /** Content to render inside the view sheet. Receives the selected user. */
    sheetContent?: (user: UserTableUser) => React.ReactNode;
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function UserTable({
    users,
    onView,
    onBlock,
    sheetContent,
}: UserTableProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserTableUser | null>(null);

    const handleViewClick = (user: UserTableUser) => {
        setSelectedUser(user);
        setSheetOpen(true);
        onView?.(user);
    };

    return (
        <>
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead >User</TableHead>
                            <TableHead >Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined on</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.joinedOn}</TableCell>
                                    <TableCell>
                                        <span
                                            className={cn(
                                                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                user.status === "active" &&
                                                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                                                user.status === "inactive" &&
                                                "bg-muted text-muted-foreground",
                                                user.status === "blocked" &&
                                                "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            )}
                                        >
                                            {user.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewClick(user)}
                                                className="gap-1.5"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onBlock?.(user)}
                                                className="gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                                Block
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-bold">
                            User details
                        </SheetTitle>
                        <SheetDescription className="text-sm text-muted-foreground">
                            View and manage user details.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 px-4">
                        {selectedUser &&
                            (sheetContent ? (
                                sheetContent(selectedUser)
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Add your content here.
                                </p>
                            ))}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
