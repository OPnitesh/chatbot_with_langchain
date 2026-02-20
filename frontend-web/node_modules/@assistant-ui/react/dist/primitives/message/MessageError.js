"use client";
import { useAuiState } from "@assistant-ui/store";
export const MessagePrimitiveError = ({ children }) => {
    const hasError = useAuiState((s) => s.message.status?.type === "incomplete" &&
        s.message.status.reason === "error");
    return hasError ? children : null;
};
MessagePrimitiveError.displayName = "MessagePrimitive.Error";
//# sourceMappingURL=MessageError.js.map