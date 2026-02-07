"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import PolicyModal from "./PolicyModal";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";

function PrivacyPolicy() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policyContent, setPolicyContent] = useState("");

    const isAdmin = true;

    const handleEditClick = () => setIsModalOpen(true);

    const handleSave = (htmlContent: string) => {
        setPolicyContent(htmlContent);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-start justify-between">
                <SmallPageInfo
                    title="Privacy Policy"
                    description="Here is an overview of your privacy policy"
                />
                {isAdmin && (
                    <Button onClick={handleEditClick}>
                        <FiEdit3 size={15} /> Edit Privacy Policy
                    </Button>
                )}
            </div>

            <div className="space-y-4 border bg-white p-4 rounded-lg min-h-[700px]">
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
                {policyContent ? (
                    <div
                        className="text-base text-gray-700 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: policyContent }}
                    />
                ) : (
                    <p className="text-base text-gray-500">
                        No privacy policy content available.
                    </p>
                )}
            </div>

            <PolicyModal
                key={isModalOpen ? "open" : "closed"}
                openModal={isModalOpen}
                setOpenModal={setIsModalOpen}
                title="Edit Privacy Policy"
                content={policyContent}
                onSave={handleSave}
                isLoading={false}
            />
        </div>
    );
}

export default PrivacyPolicy;
