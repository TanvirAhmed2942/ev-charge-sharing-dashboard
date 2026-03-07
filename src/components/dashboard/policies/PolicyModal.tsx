"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TipTapEditor from "@/tiptap/TipTapEditor";
import { Loader } from "lucide-react";

type PolicyModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  title?: string;
  content?: string;
  onSave?: (content: string) => void | Promise<void>;
  isLoading?: boolean;
};

function PolicyModal({
  openModal,
  setOpenModal,
  title = "Edit Policy",
  content = "",
  onSave,
  isLoading = false,
}: PolicyModalProps) {
  const [editorContent, setEditorContent] = useState(content);

  // Sync editor with content when modal opens or content prop changes
  useEffect(() => {
    if (openModal) {
      setTimeout(() => {
        setEditorContent(content ?? "");
      }, 100);
    }
  }, [openModal, content]);

  const handleContentChange = useCallback((html: string) => {
    setEditorContent(html);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editorContent.trim()) return;
    if (onSave) await onSave(editorContent);
  }, [editorContent, onSave]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpenModal(open);
    },
    [setOpenModal]
  );

  return (
    <Dialog open={openModal} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-3xl lg:max-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-semibold text-left">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 py-4">
          <TipTapEditor
            content={editorContent}
            onChange={handleContentChange}
            minHeight="400px"
            maxHeight="600px"
            height="500px"
            wordLimit={10000}
            placeholder="Start editing your policy content..."
            showWordCount={false}
            className="w-full"
          />
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenModal(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !editorContent.trim()}
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            {isLoading ? (
              <>
                Saving...{" "}
                <Loader className="ml-2 inline-block h-4 w-4 animate-spin" />
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default PolicyModal;
