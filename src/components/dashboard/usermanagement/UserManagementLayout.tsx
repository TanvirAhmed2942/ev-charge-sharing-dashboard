"use client";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import UserTable, { type UserTableUser } from "@/components/common/usertable/UserTable";
import SearchFilterButton from "@/components/common/filter/FIlterSearch";
import UserInfo from "./UserInfo";

const sampleUsers: UserTableUser[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "User",
        joinedOn: "Jan 15, 2025",
        status: "active",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "User",
        joinedOn: "Jan 10, 2025",
        status: "active",
    },
];

function UserManagementLayout() {
    return (
        <div className="space-y-6">
            <SmallPageInfo
                title="User Management"
                description="Manage your users"
            />
            <SearchFilterButton
                placeholder="Search User"
                showFilterButton={true}
                selectOptions={["All Status", "Active", "Blocked"]}
            />
            <UserTable
                users={sampleUsers}
                onView={(user) => console.log("View", user)}
                onBlock={(user) => console.log("Block", user)}
                sheetContent={(user) => <UserInfo user={user} />}
            />
        </div>
    );
}

export default UserManagementLayout;