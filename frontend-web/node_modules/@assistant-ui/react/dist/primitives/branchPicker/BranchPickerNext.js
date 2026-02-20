"use client";
import { createActionButton, } from "../../utils/createActionButton.js";
import { useCallback } from "react";
import { useAuiState, useAui } from "@assistant-ui/store";
const useBranchPickerNext = () => {
    const aui = useAui();
    const disabled = useAuiState((s) => {
        // Disabled if no next branch
        if (s.message.branchNumber >= s.message.branchCount)
            return true;
        // Disabled if running and capability not supported
        if (s.thread.isRunning && !s.thread.capabilities.switchBranchDuringRun) {
            return true;
        }
        return false;
    });
    const callback = useCallback(() => {
        aui.message().switchToBranch({ position: "next" });
    }, [aui]);
    if (disabled)
        return null;
    return callback;
};
/**
 * A button component that navigates to the next branch in the message tree.
 *
 * This component automatically handles switching to the next available branch
 * and is disabled when there are no more branches to navigate to.
 *
 * @example
 * ```tsx
 * <BranchPickerPrimitive.Next>
 *   Next →
 * </BranchPickerPrimitive.Next>
 * ```
 */
export const BranchPickerPrimitiveNext = createActionButton("BranchPickerPrimitive.Next", useBranchPickerNext);
//# sourceMappingURL=BranchPickerNext.js.map