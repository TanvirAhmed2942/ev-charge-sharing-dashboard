"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader } from "lucide-react";

/**
 * Reusable delete confirmation modal for any entity (FAQ, user, item, etc.).
 * Pass title, description, and onConfirm (async supported). Use isLoading for button state.
 */
export interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  /** Shown on confirm button when isLoading (e.g. "Blocking...", "Deleting..."). Default "Deleting..." */
  loadingText?: string;
  cancelText?: string;
  isLoading?: boolean;
  /** Confirm button style: "destructive" (red) or "default" (primary). Default "destructive". */
  confirmVariant?: "default" | "destructive";
}

const DEFAULT_DESCRIPTION =
  "Are you sure you want to delete this? This action cannot be undone.";

function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete",
  description = DEFAULT_DESCRIPTION,
  confirmText = "Delete",
  loadingText = "Deleting...",
  cancelText = "Cancel",
  isLoading = false,
  confirmVariant = "destructive",
}: DeleteConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleOpenChange = (openValue: boolean) => {
    if (!isLoading) {
      onOpenChange(openValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <DialogDescription className="pt-4 pb-2">
          {description}
        </DialogDescription>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            className={confirmVariant === "destructive" ? undefined : "bg-green-600 hover:bg-green-700"}
          >
            {isLoading ? (
              <>
                {loadingText}
                <Loader className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteConfirmationModal;
