"use client";

import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useGetProfileQuery } from "@/store/Apis/profileApi/profileApi";
import { updateUser, selectUser } from "@/store/slices/userSlice/userSlice";
import { useImageUrl } from "@/hooks/useImageUrl";

type DashboardHeaderUserProps = {
  /** Content to render inside the sheet (e.g. profile form, links). Pass from layout. */
  children?: React.ReactNode;
};

export function DashboardHeaderUser({ children }: DashboardHeaderUserProps) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { data: profileData } = useGetProfileQuery();

  // Sync profile API response into user slice
  useEffect(() => {
    const profile = profileData?.data;
    if (!profile) return;
    dispatch(
      updateUser({
        _id: profile._id,
        name: profile.fullName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        role: profile.role ?? "user",
        profile: profile.profile,
        adminComission: profile.adminComission ?? 0,
      })
    );
  }, [profileData?.data, dispatch]);

  const displayName = (user?.name || profileData?.data?.fullName) ?? "";
  const displayEmail = (user?.email || profileData?.data?.email) ?? "";
  const avatarSrc = user?.profile || profileData?.data?.profile;
  const imageUrl = useImageUrl(avatarSrc || "", "https://github.com/shadcn.png");
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 cursor-pointer hover:bg-muted rounded-lg p-2 text-left"
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{displayName?.charAt(0)?.toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{displayEmail}</p>
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
