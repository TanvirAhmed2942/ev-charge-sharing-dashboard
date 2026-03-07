"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";
import PolicyModal from "./PolicyModal";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import {
  useGetPoliciesQuery,
  useUpdatePoliciesMutation,
} from "@/store/Apis/policiesApi/policiesApi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";

function AboutUs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const { data: policies } = useGetPoliciesQuery();
  const [updatePolicies, { isLoading: isUpdating }] = useUpdatePoliciesMutation();
  const isAdmin = true;

  const aboutContent = policies?.data?.aboutUs ?? "";

  const handleEditClick = () => setIsModalOpen(true);

  const handleSave = async (htmlContent: string) => {
    const res = await updatePolicies({ aboutUs: htmlContent });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    if (res.data?.success) {
      toast.success(res.data?.message ?? "About us updated.");
      setIsModalOpen(false);
    } else {
      toast.error(res.data?.message ?? "Failed to update.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <SmallPageInfo
          title="About Us"
          description="Here is an overview of your about us"
        />
        {isAdmin && (
          <Button onClick={handleEditClick}>
            <FiEdit3 size={15} /> Edit About Us
          </Button>
        )}
      </div>

      <div className="space-y-4 border bg-card p-4 rounded-lg min-h-[700px]">
        <h1 className="text-2xl font-bold">About Us</h1>
        {aboutContent ? (
          <div
            className="text-base text-muted-foreground prose max-w-none prose-p:text-foreground"
            dangerouslySetInnerHTML={{ __html: aboutContent }}
          />
        ) : (
          <p className="text-base text-muted-foreground">
            No about us content available.
          </p>
        )}
      </div>

      <PolicyModal
        key={isModalOpen ? "open" : "closed"}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
        title="Edit About Us"
        content={aboutContent}
        onSave={handleSave}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default AboutUs;
