"use client";
import SearchFilterButton from "@/components/common/filter/FIlterSearch";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import UserTable from "@/components/common/usertable/UserTable";
import ParkingSpaceOwnerInfo, { type ParkingSpaceOwnerInfoUser } from "./ParkingSpaceOwnerInfo";


const sampleUsers: ParkingSpaceOwnerInfoUser[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "Parking Space Owner",
        joinedOn: "Jan 15, 2025",
        status: "active",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Parking Space Owner",
        joinedOn: "Jan 10, 2025",
        status: "active",
    },
];

function ParkingSpaceOwnerPageLayout() {
    return (
        <div className="space-y-6">
            <SmallPageInfo
                title="Parking Space Owners"
                description="Manage your parking space owners"
            />
            <SearchFilterButton
                placeholder="Search Parking Space Owner"
                showFilterButton={true}
                selectOptions={["All Status", "Active", "Blocked"]}
            />
            <UserTable
                users={sampleUsers}
                onView={(user) => console.log("View", user)}
                onBlock={(user) => console.log("Block", user)}
                sheetContent={(user) => <ParkingSpaceOwnerInfo user={user} />}
            />
        </div>
    );
}

export default ParkingSpaceOwnerPageLayout;