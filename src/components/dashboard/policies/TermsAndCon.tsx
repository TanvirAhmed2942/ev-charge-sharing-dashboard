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

function TermsAndContions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const { data: policies } = useGetPoliciesQuery();
  const [updatePolicies, { isLoading: isUpdating }] = useUpdatePoliciesMutation();
  const isAdmin = true;

  const termsContent = policies?.data?.termsOfService ?? "";

  const handleEditClick = () => setIsModalOpen(true);

  const handleSave = async (htmlContent: string) => {
    const res = await updatePolicies({ termsOfService: htmlContent });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    if (res.data?.success) {
      toast.success(res.data?.message ?? "Terms and conditions updated.");
      setIsModalOpen(false);
    } else {
      toast.error(res.data?.message ?? "Failed to update.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start justify-between">
        <SmallPageInfo
          title="Terms and Conditions"
          description="Here is an overview of your terms and conditions"
        />
        {isAdmin && (
          <Button onClick={handleEditClick}>
            <FiEdit3 size={15} /> Edit T&C
          </Button>
        )}
      </div>

      <div className="space-y-4 border bg-card p-4 rounded-lg min-h-[700px]">
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
        {termsContent ? (
          <div
            className="text-base text-muted-foreground prose max-w-none prose-p:text-foreground"
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        ) : (
          <p className="text-base text-muted-foreground">
            No terms and conditions content available.
          </p>
        )}
      </div>

      <PolicyModal
        key={isModalOpen ? "open" : "closed"}
        openModal={isModalOpen}
        setOpenModal={setIsModalOpen}
        title="Edit Terms and Conditions"
        content={termsContent}
        onSave={handleSave}
        isLoading={isUpdating}
      />
    </div>
  );
}

export default TermsAndContions;
