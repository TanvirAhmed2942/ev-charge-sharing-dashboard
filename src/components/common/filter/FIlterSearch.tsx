"use client";
import { HiPlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
type SearchFilterButtonProps = {
    showAddButton?: boolean;
    onClickAddButton?: () => void;
    addButtonText?: string;
    showFilterButton?: boolean;
    selectOptions?: string[];
    placeholder?: string;
    searchByDate?: boolean;
    searchText?: string;
    setSearchText?: (text: string) => void;
    status?: string;
    setStatus?: (status: string) => void;
    selectedDate?: string;
    setSelectedDate?: (date: string) => void;
}
function SearchFilterButton({
    showAddButton = false,
    onClickAddButton = () => { },
    addButtonText = "Add New Client",
    showFilterButton = true,
    selectOptions = ["All Status"],
    placeholder = "Search Client",
    searchByDate = false,
    searchText = "",
    setSearchText = () => { },
    status = "All Status",
    setStatus = () => { },
    selectedDate = "",
    setSelectedDate = () => { },
}: SearchFilterButtonProps) {
    return (
        <div className="flex items-center gap-2 ">
            <Input
                className="flex-1 bg-white border-gray-300"
                placeholder={placeholder}
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            />
            {showFilterButton && (
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {selectOptions.map((option, index) => (
                            <SelectItem key={index} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {showAddButton && (
                <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={onClickAddButton}
                >
                    <HiPlus /> {addButtonText}
                </Button>
            )}

            {searchByDate && (
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        className="bg-white border-gray-300"
                        value={selectedDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}

export default SearchFilterButton;