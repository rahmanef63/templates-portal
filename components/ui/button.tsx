"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Minimal shadcn-compatible Button shim — satisfies the vendored three-column
// layout's `@/components/ui/button` import without pulling in class-variance-
// authority or @radix-ui/react-slot. Supports the variant/size set the layout
// actually uses (ghost/icon/sm). Styled with portal theme tokens.

type Variant = "default" | "ghost" | "secondary" | "outline" | "destructive";
type Size = "default" | "sm" | "icon";

const VARIANTS: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  ghost: "hover:bg-muted hover:text-foreground",
  secondary: "bg-muted text-foreground hover:bg-muted/80",
  outline: "border border-border hover:bg-muted hover:text-foreground",
  destructive: "bg-primary text-primary-foreground hover:bg-primary/90",
};

const SIZES: Record<Size, string> = {
  default: "h-9 px-4 py-2",
  sm: "h-8 px-3 text-sm",
  icon: "h-9 w-9",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type, ...props }, ref) => (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
