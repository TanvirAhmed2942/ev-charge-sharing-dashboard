"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Percent, Save } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "@/store/slices/userSlice/userSlice";
import { useUpdateCommissionMutation } from "@/store/Apis/profileApi/profileApi";
import useToast from "@/hooks/useToast";
import { getApiErrorMessage, type RtkQueryError } from "@/lib/apiError";

type CommissionSettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Keyed by initial value so when modal opens we get fresh state without useEffect */
function CommissionForm({
  initialCommission,
  onSuccess,
}: {
  initialCommission: number;
  onSuccess: () => void;
}) {
  const toast = useToast();
  const dispatch = useDispatch();
  const [commission, setCommission] = useState(() => String(initialCommission));
  const [updateCommissionMutation, { isLoading }] = useUpdateCommissionMutation();

  const commissionNum = Math.min(100, Math.max(0, Number(commission) || 0));
  const exampleAmount = 100;
  const exampleCommission = (exampleAmount * commissionNum) / 100;
  const exampleOwnerReceives = exampleAmount - exampleCommission;

  const handleSave = async () => {
    const value = commissionNum;
    const res = await updateCommissionMutation({ admin_comission: value });
    if (res.error) {
      toast.error(getApiErrorMessage(res.error as RtkQueryError));
      return;
    }
    if (res.data?.success) {
      dispatch(updateUser({ adminComission: value }));
      toast.success("Commission updated successfully.");
      onSuccess();
    } else {
      toast.error(res.data?.message ?? "Failed to update commission.");
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="commission">Platform Commission (%)</Label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id="commission"
            type="number"
            min={0}
            max={100}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">
            % of each transaction
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Commission charged to parking space owners
        </p>
      </div>

      <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
        Example: For a €{exampleAmount} booking, parking owner receives €
        {exampleOwnerReceives.toFixed(0)} (€
        {exampleCommission.toFixed(0)} commission)
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <>
              Saving...
              <Loader className="h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function CommissionSettingsModal({
  open,
  onOpenChange,
}: CommissionSettingsModalProps) {
  const user = useSelector(selectUser);
  const initialCommission = user?.adminComission ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
            <Percent className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <DialogTitle className="text-left">
            Commission Settings
          </DialogTitle>
        </DialogHeader>

        {open && (
          <CommissionForm
            key={initialCommission}
            initialCommission={initialCommission}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
