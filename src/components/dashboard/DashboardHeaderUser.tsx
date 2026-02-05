"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MyInfo from "./myprofile/MyInfo";
import Logout from "./myprofile/Logout";
import ChangePassword from "./myprofile/ChangePassword";
import { ScrollArea } from "@/components/ui/scroll-area";

type DashboardHeaderUserProps = {
  /** Content to render inside the sheet (e.g. profile form, links). Pass from layout. */
  children?: React.ReactNode;
};

export function DashboardHeaderUser({ children }: DashboardHeaderUserProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 cursor-pointer hover:bg-muted rounded-lg p-2 text-left"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">John Doe</p>
          <p className="text-xs text-muted-foreground">john.doe@example.com</p>
        </div>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader className="pb-0 mb-0">
            <SheetTitle>User info</SheetTitle>
            <SheetDescription>Manage your account settings and preferences.</SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <div className=" space-y-4 px-4">
              {children ?? (
                <>
                  <MyInfo />
                  <ChangePassword />
                  <Logout />
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
