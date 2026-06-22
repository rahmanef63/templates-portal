"use client";

import * as React from "react";

// ponytail: passthrough tooltip shims. The vendored three-column layout uses
// tooltips only as optional hover hints on its collapse rails — non-essential
// chrome. These satisfy the `@/components/ui/tooltip` import without pulling in
// @radix-ui/react-tooltip: the trigger renders its child, the content is dropped
// (no floating popup). Extra props (delayDuration, side, asChild) are accepted
// and ignored. Swap in a real tooltip lib if the hints become important.

type AnyProps = { children?: React.ReactNode } & Record<string, unknown>;

export function TooltipProvider({ children }: AnyProps) {
  return <>{children}</>;
}

export function Tooltip({ children }: AnyProps) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: AnyProps) {
  return <>{children}</>;
}

export function TooltipContent(_props: AnyProps) {
  return null;
}
