"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Primitive } from "@radix-ui/react-primitive";
import { forwardRef } from "react";
import { useAuiState } from "@assistant-ui/store";
export const ErrorPrimitiveMessage = forwardRef(({ children, ...props }, forwardRef) => {
    const error = useAuiState((s) => {
        return s.message.status?.type === "incomplete" &&
            s.message.status.reason === "error"
            ? s.message.status.error
            : undefined;
    });
    if (error === undefined)
        return null;
    return (_jsx(Primitive.span, { ...props, ref: forwardRef, children: children ?? String(error) }));
});
ErrorPrimitiveMessage.displayName = "ErrorPrimitive.Message";
//# sourceMappingURL=ErrorMessage.js.map