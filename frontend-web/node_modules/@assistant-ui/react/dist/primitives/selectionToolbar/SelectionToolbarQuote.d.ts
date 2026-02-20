import { Primitive } from "@radix-ui/react-primitive";
import { type ComponentPropsWithoutRef, type ComponentRef } from "react";
export declare namespace SelectionToolbarPrimitiveQuote {
    type Element = ComponentRef<typeof Primitive.button>;
    type Props = ComponentPropsWithoutRef<typeof Primitive.button>;
}
/**
 * A button that quotes the currently selected text.
 *
 * Must be placed inside `SelectionToolbarPrimitive.Root`. Reads the
 * selection info from context (captured by the Root), sets it as a
 * quote in the thread composer, and clears the selection.
 *
 * @example
 * ```tsx
 * <SelectionToolbarPrimitive.Quote>
 *   <QuoteIcon /> Quote
 * </SelectionToolbarPrimitive.Quote>
 * ```
 */
export declare const SelectionToolbarPrimitiveQuote: import("react").ForwardRefExoticComponent<Omit<import("react").ClassAttributes<HTMLButtonElement> & import("react").ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
}, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=SelectionToolbarQuote.d.ts.map