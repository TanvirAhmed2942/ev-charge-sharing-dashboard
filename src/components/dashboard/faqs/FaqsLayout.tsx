"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader, Plus, Trash2 } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import SmallPageInfo from "@/components/common/smallPageInfo/smallPageInfo";
import { FcFaq } from "react-icons/fc";
import {
  useGetAllFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/store/Apis/faqApi/faqApi";
import type { FaqItem } from "@/store/Apis/faqApi/faqApi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";
import DeleteConfirmationModal from "@/components/common/deleteconfirmation/deleteConfirmationModal";

type FaqSection = {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
};

function mapFaqToSection(item: FaqItem): FaqSection {
  return {
    id: item._id,
    title: item.question,
    content: item.answer,
    isNew: false,
  };
}

function FaqsLayout() {
  const toast = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [editableSections, setEditableSections] = useState<FaqSection[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; isNew: boolean } | null>(null);

  const { data, isLoading } = useGetAllFaqsQuery();
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const apiSections = useMemo(
    () => (data?.data ?? []).map(mapFaqToSection),
    [data?.data]
  );
  const sections = isEditMode ? editableSections : apiSections;
  const isSaving = isCreating || isUpdating;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEditClick = () => {
    setEditableSections(apiSections);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setEditableSections([]);
  };

  const handleSave = async () => {
    let hasError = false;
    for (const section of editableSections) {
      if (section.isNew) {
        const res = await createFaq({
          question: section.title,
          answer: section.content,
        });
        if (res.error) {
          toast.error(getApiErrorMessage(res.error as RtkQueryError));
          hasError = true;
        }
      } else {
        const res = await updateFaq({
          _id: section.id,
          question: section.title,
          answer: section.content,
        });
        if (res.error) {
          toast.error(getApiErrorMessage(res.error as RtkQueryError));
          hasError = true;
        }
      }
    }
    if (!hasError) {
      toast.success("FAQs saved successfully.");
      setIsEditMode(false);
      setEditableSections([]);
    }
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setEditableSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleContentChange = (id: string, newContent: string) => {
    setEditableSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: newContent } : s))
    );
  };

  const handleAddNewSection = () => {
    const newId = `new-${Date.now()}`;
    setEditableSections((prev) => [
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

  const handleDeleteSection = async (id: string, isNew: boolean) => {
    if (!isNew) {
      const res = await deleteFaq(id);
      if (res.error) {
        toast.error(getApiErrorMessage(res.error as RtkQueryError));
        return;
      }
      toast.success("FAQ deleted.");
    }
    setEditableSections((prev) => prev.filter((s) => s.id !== id));
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const openDeleteModal = (id: string, isNew: boolean) => {
    setPendingDelete({ id, isNew });
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    await handleDeleteSection(pendingDelete.id, pendingDelete.isNew);
    closeDeleteModal();
  };

  const isAdmin = true;

    if (isLoading) {
    return (
      <div className="space-y-6">
        <SmallPageInfo
          title="Faqs"
          icon={<FcFaq />}
          description="Here is an overview of your faqs"
        />
        <div className="flex items-center justify-center py-12 border rounded-lg bg-card">
          <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

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
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || editableSections.length === 0}
                  className="bg-black hover:bg-black/80 text-white"
                >
                  {isSaving ? (
                    <>
                      Saving... <Loader className="ml-2 inline h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Save"
                  )}
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
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-card">
          <FcFaq className="text-6xl mb-4" />
          <p className="text-muted-foreground mb-4">No FAQs found</p>
          {isAdmin && (
            <Button onClick={handleEditClick}>
              <Plus size={16} className="mr-2" />
              Add Your First FAQ
            </Button>
          )}
        </div>
      )}

      {(sections.length > 0 || isEditMode) && (
        <div className="border rounded-lg bg-card">
          {sections.map((section, index) => {
            const isOpen = openSections.has(section.id);
            const isLast = index === sections.length - 1;

            return (
              <div
                key={section.id}
                className={`border-b border-border ${isLast ? "border-b-0" : ""}`}
              >
                <div className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  {isEditMode ? (
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        handleTitleChange(section.id, e.target.value)
                      }
                      className="flex-1 mr-4 font-semibold border-input"
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Enter FAQ question..."
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex-1 text-left"
                    >
                      <h3 className="text-base font-semibold text-foreground">
                        {section.title}
                      </h3>
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    {isEditMode && isAdmin && (
                      <button
                        type="button"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          openDeleteModal(section.id, section.isNew);
                        }}
                        disabled={isDeleting}
                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                        title="Delete FAQ"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="shrink-0"
                    >
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
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
                          ? "bg-background border-input text-foreground"
                          : "bg-muted/50 border-border text-foreground"
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

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ"
        description="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default FaqsLayout;
