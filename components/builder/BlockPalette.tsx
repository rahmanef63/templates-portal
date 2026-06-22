"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { REGISTRY, BLOCK_ORDER } from "@/components/blocks/registry";

// Controlled, pure-presentational palette. Lists every registered block in
// canonical order; clicking a row asks the parent to append that block. Holds
// no state — the page config lives in the parent.
export default function BlockPalette({
  onAdd,
}: {
  onAdd: (type: string) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Add block
      </h2>

      <div className="flex flex-col gap-2">
        {BLOCK_ORDER.map((type) => {
          const def = REGISTRY[type];
          if (!def) return null;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              aria-label={`Add ${def.name} block`}
              className="group flex w-full items-center gap-3 rounded-lg border border-border bg-background px-3 py-3 text-left transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {def.name}
                </span>
                {def.description ? (
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {def.description}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Plus size={16} weight="bold" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
