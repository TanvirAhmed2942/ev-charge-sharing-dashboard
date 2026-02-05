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
import { Percent, Save } from "lucide-react";

type CommissionSettingsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const DEFAULT_COMMISSION = 15;

export default function CommissionSettingsModal({
    open,
    onOpenChange,
}: CommissionSettingsModalProps) {
    const [commission, setCommission] = useState<string>(String(DEFAULT_COMMISSION));

    const commissionNum = Number(commission) || 0;
    const exampleAmount = 100;
    const exampleCommission = (exampleAmount * commissionNum) / 100;
    const exampleOwnerReceives = exampleAmount - exampleCommission;

    const handleSave = () => {
        // TODO: persist commission (e.g. API call)
        onOpenChange(false);
    };

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

                <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label htmlFor="commission">
                            Platform Commission (%)
                        </Label>
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
                        Example: For a €{exampleAmount} booking, parking owner
                        receives €{exampleOwnerReceives.toFixed(0)} (€
                        {exampleCommission.toFixed(0)} commission)
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save All Settings
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
