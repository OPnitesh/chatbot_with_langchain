"use client";
import { useAuiState } from "@assistant-ui/store";
/**
 * Hook that returns the quote info for the current message, if any.
 *
 * Reads from `message.metadata.custom.quote`.
 *
 * @example
 * ```tsx
 * function QuoteBlock() {
 *   const quote = useMessageQuote();
 *   if (!quote) return null;
 *   return <blockquote>{quote.text}</blockquote>;
 * }
 * ```
 */
export const useMessageQuote = () => {
    return useAuiState((s) => s.message.metadata?.custom?.quote);
};
//# sourceMappingURL=useMessageQuote.js.map