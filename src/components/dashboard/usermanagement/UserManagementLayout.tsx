"use client";

import { useState, useMemo, useEffect } from "react";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import UserTable, {
  type UserTableUser,
} from "@/components/common/usertable/UserTable";
import SearchFilterButton from "@/components/common/filter/FIlterSearch";
import Pagination from "@/components/common/pagination/Pagination";
import DeleteConfirmationModal from "@/components/common/deleteconfirmation/deleteConfirmationModal";
import UserInfo from "./UserInfo";
import {
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
  type UserListItem,
} from "@/store/Apis/usersApi/usersApi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import { Loader } from "lucide-react";

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_OPTIONS = ["All Status", "Active", "Blocked"] as const;
type StatusOption = (typeof STATUS_OPTIONS)[number];

function statusToIsActive(status: StatusOption): boolean | undefined {
  if (status === "Active") return true;
  if (status === "Blocked") return false;
  return undefined;
}

function formatJoinedOn(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return createdAt;
  }
}

function mapUserToTableUser(
  item: UserListItem,
  getAvatarUrl: (path: string) => string
): UserTableUser {
  return {
    id: item._id,
    name: item.fullName,
    email: item.email,
    avatar: item.profile ? getAvatarUrl(item.profile) : null,
    role: item.role,
    joinedOn: formatJoinedOn(item.createdAt),
    status: item.isActive ? "active" : "blocked",
  };
}

type BlockModalAction = { userId: string; action: "block" | "unblock" };

function UserManagementLayout() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<StatusOption>("All Status");
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [userToAction, setUserToAction] = useState<BlockModalAction | null>(null);

  const toast = useToast();
  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();
  const isBlockModalLoading = isBlocking || isUnblocking;

  const openBlockModal = (user: UserTableUser) => {
    setUserToAction({ userId: user.id, action: "block" });
    setBlockModalOpen(true);
  };
  const openUnblockModal = (user: UserTableUser) => {
    setUserToAction({ userId: user.id, action: "unblock" });
    setBlockModalOpen(true);
  };

  const handleBlockConfirm = async () => {
    if (!userToAction) return;
    const mutation = userToAction.action === "block" ? blockUser : unblockUser;
    const res = await mutation(userToAction.userId);
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError) ?? "Something went wrong");
      return;
    }
    toast.success(
      userToAction.action === "block"
        ? "User blocked successfully."
        : "User unblocked successfully."
    );
    setBlockModalOpen(false);
    setUserToAction(null);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput]);

  const isActive = statusToIsActive(status);

  const { data, isLoading } = useGetAllUsersQuery({
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(typeof isActive === "boolean" && { isActive }),
  });

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus((value as StatusOption) || "All Status");
    setPage(1);
  };

  const tableUsers: UserTableUser[] = useMemo(() => {
    const list = data?.data;
    if (!list) return [];
    const base = (process.env.NEXT_PUBLIC_IMAGE_URL ?? "").replace(/\/$/, "");
    const getAvatarUrl = (path: string) => {
      if (!path) return "";
      const normalized = path.replace(/\\/g, "/").replace(/^\//, "");
      if (
        path.startsWith("http") ||
        path.startsWith("blob") ||
        path.startsWith("data")
      )
        return path;
      return base ? `${base}/${normalized}` : `/${normalized}`;
    };
    return list.map((u) => mapUserToTableUser(u, getAvatarUrl));
  }, [data]);

  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <SmallPageInfo
        title="User Management"
        description="Manage your users"
      />
      <SearchFilterButton
        placeholder="Search User"
        showFilterButton={true}
        selectOptions={[...STATUS_OPTIONS]}
        searchText={searchInput}
        setSearchText={setSearchInput}
        status={status}
        setStatus={handleStatusChange}
      />

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border bg-card py-12">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <UserTable
            users={tableUsers}
            onView={() => {}}
            onBlock={openBlockModal}
            onUnblock={openUnblockModal}
            sheetContent={(user) => (
              <UserInfo
                userId={user.id}
                onBlock={() => openBlockModal(user)}
                onUnblock={() => openUnblockModal(user)}
              />
            )}
          />
          <DeleteConfirmationModal
            open={blockModalOpen}
            onOpenChange={(open) => {
              setBlockModalOpen(open);
              if (!open) setUserToAction(null);
            }}
            onConfirm={handleBlockConfirm}
            title={userToAction?.action === "block" ? "Block user" : "Unblock user"}
            description={
              userToAction?.action === "block"
                ? "This user will not be able to sign in. You can unblock them later."
                : "This user will be able to sign in again."
            }
            confirmText={userToAction?.action === "block" ? "Block" : "Unblock"}
            loadingText={userToAction?.action === "block" ? "Blocking..." : "Unblocking..."}
            cancelText="Cancel"
            isLoading={isBlockModalLoading}
          />
          {meta && meta.totalPage > 0 && (
            <Pagination
              page={meta.page}
              totalPage={meta.totalPage}
              total={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
              onLimitChange={handleLimitChange}
              showSummary={true}
            />
          )}
        </>
      )}
    </div>
  );
}

export default UserManagementLayout;