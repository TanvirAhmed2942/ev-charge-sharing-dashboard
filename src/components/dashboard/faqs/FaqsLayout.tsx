"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { FcFaq } from "react-icons/fc";

type FaqSection = {
    id: string;
    title: string;
    content: string;
    isNew: boolean;
};

function FaqsLayout() {
    const [isEditMode, setIsEditMode] = useState(false);
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());
    const [sections, setSections] = useState<FaqSection[]>([]);

    const toggleSection = (id: string) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleEditClick = () => setIsEditMode(true);

    const handleCancel = () => setIsEditMode(false);

    const handleSave = () => setIsEditMode(false);

    const handleTitleChange = (id: string, newTitle: string) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
        );
    };

    const handleContentChange = (id: string, newContent: string) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, content: newContent } : s))
        );
    };

    const handleAddNewSection = () => {
        const newId = `new-${Date.now()}`;
        setSections((prev) => [
            ...prev,
            {
                id: newId,
                title: "New FAQ Question",
                content: "Enter your answer here...",
                isNew: true,
            },
        ]);
        setOpenSections((prev) => new Set([...prev, newId]));
    };

    const handleDeleteSection = (id: string) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
        setOpenSections((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const isAdmin = true;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <SmallPageInfo
                    title="Faqs"
                    icon={<FcFaq />}
                    description="Here is an overview of your faqs"
                />
                {isAdmin && (
                    <div className="flex items-center gap-2">
                        {isEditMode && (
                            <Button
                                onClick={handleAddNewSection}
                                className="bg-black hover:bg-black/80 text-white"
                            >
                                <Plus size={16} />
                                Add FAQ
                            </Button>
                        )}
                        {isEditMode ? (
                            <>
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="bg-black hover:bg-black/80 text-white"
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={handleEditClick}
                                className="hover:bg-white hover:text-red-400"
                            >
                                <FiEdit3 size={15} />
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {sections.length === 0 && !isEditMode && (
                <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-white">
                    <FcFaq className="text-6xl mb-4" />
                    <p className="text-gray-500 mb-4">No FAQs found</p>
                    {isAdmin && (
                        <Button onClick={handleEditClick}>
                            <Plus size={16} className="mr-2" />
                            Add Your First FAQ
                        </Button>
                    )}
                </div>
            )}

            {(sections.length > 0 || isEditMode) && (
                <div className="border rounded-lg bg-white">
                    {sections.map((section, index) => {
                        const isOpen = openSections.has(section.id);
                        const isLast = index === sections.length - 1;

                        return (
                            <div
                                key={section.id}
                                className={`border-b ${isLast ? "border-b-0" : ""}`}
                            >
                                <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    {isEditMode ? (
                                        <Input
                                            value={section.title}
                                            onChange={(e) =>
                                                handleTitleChange(section.id, e.target.value)
                                            }
                                            className="flex-1 mr-4 font-semibold text-gray-900 border-gray-300"
                                            onClick={(e) => e.stopPropagation()}
                                            placeholder="Enter FAQ question..."
                                        />
                                    ) : (
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="flex-1 text-left"
                                        >
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {section.title}
                                            </h3>
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {isEditMode && isAdmin && (
                                            <button
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    if (
                                                        window.confirm(
                                                            "Are you sure you want to delete this FAQ?"
                                                        )
                                                    ) {
                                                        handleDeleteSection(section.id);
                                                    }
                                                }}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete FAQ"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="shrink-0"
                                        >
                                            <ChevronDown
                                                className={`h-5 w-5 text-gray-600 transition-transform ${
                                                    isOpen ? "transform rotate-180" : ""
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="px-4 pb-4">
                                        <textarea
                                            value={section.content}
                                            readOnly={!isEditMode}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                handleContentChange(section.id, e.target.value)
                                            }
                                            className={`min-h-[120px] w-full resize-none rounded-md border px-3 py-2 text-sm ${
                                                isEditMode
                                                    ? "bg-white border-gray-300 text-gray-900"
                                                    : "bg-gray-50 border-gray-200 text-gray-900"
                                            }`}
                                            placeholder="Enter FAQ answer..."
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default FaqsLayout;
