// ponytail: minimal cn for the vendored three-column layout. It only ever passes
// strings + short-circuit conditionals (cn("a", cond && "b", className)) — no clsx
// object/array syntax and no conflicting Tailwind classes that need tailwind-merge
// dedup. So filter-truthy-strings + join is enough; swap to clsx+twMerge only if a
// future consumer needs object args or class-conflict resolution.
export function cn(...inputs: unknown[]): string {
  return inputs
    .filter((x): x is string => typeof x === "string" && x.length > 0)
    .join(" ");
}
