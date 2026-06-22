"use client";

import type React from "react";
import { CaretUp, CaretDown, Trash } from "@phosphor-icons/react/dist/ssr";
import type { BlockDef, BlockInstance } from "@/components/blocks/types";

/**
 * CanvasItem — wraps ONE rendered block on the builder preview canvas with the
 * selection + reorder/delete chrome. Controlled: it holds NO data state; the
 * parent owns the block list and supplies every callback. The only state here
 * is CSS-driven hover, which needs no React state.
 *
 * Layering (load-bearing):
 *  - z-0  full-size transparent select button (absolute inset-0) — click block,
 *         select it.
 *  - z-10 floating toolbar (top-right) + name badge (top-left). Above the select
 *         layer with pointer-events-auto, and each action stops propagation so a
 *         toolbar click never also fires select.
 *  - the live block render is pointer-events-none + select-none so its own
 *         links/accordions cannot steal the click.
 */
export default function CanvasItem({
  def,
  instance,
  selected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
}: {
  def: BlockDef;
  instance: BlockInstance;
  selected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}): React.JSX.Element {
  const Block = def.component;

  // Toolbar handlers stop propagation so the click does not bubble down to the
  // select layer underneath (and onSelect is wired only to the select button).
  const act = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  // ghost icon button; readable foreground on the toolbar surface, disabled
  // state dims and removes the pointer without shifting layout.
  const iconBtn =
    "inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground " +
    "hover:border-primary/50 hover:bg-muted hover:text-foreground border border-transparent " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 " +
    "disabled:pointer-events-none disabled:opacity-40 transition-colors";

  return (
    <div
      className={
        "group relative rounded-xl transition-shadow " +
        (selected ? "ring-2 ring-primary" : "ring-0")
      }
    >
      {/* Live preview, made inert so the block's own interactivity is dead on
          the canvas. The wrapper is the visual block; chrome floats over it. */}
      <div className="pointer-events-none select-none">
        <Block {...instance.props} />
      </div>

      {/* Select layer: full-size transparent button beneath the chrome. */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`Select ${def.name}`}
        aria-pressed={selected}
        className="absolute inset-0 z-0 h-full w-full cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      />

      {/* Name badge (top-left) — visible on hover or when selected. */}
      <span
        className={
          "pointer-events-none absolute left-2 top-2 z-10 rounded-lg border border-border " +
          "bg-background/90 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground " +
          "opacity-0 transition-opacity group-hover:opacity-100 " +
          (selected ? "opacity-100" : "")
        }
      >
        {def.name}
      </span>

      {/* Floating toolbar (top-right) — above the select layer, interactive. */}
      <div
        className={
          "pointer-events-auto absolute right-2 top-2 z-10 flex items-center gap-1 rounded-lg " +
          "border border-border bg-background/90 p-1 backdrop-blur " +
          "opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 " +
          (selected ? "opacity-100" : "")
        }
      >
        <button
          type="button"
          onClick={act(onMoveUp)}
          disabled={isFirst}
          aria-label={`Move ${def.name} up`}
          className={iconBtn}
        >
          <CaretUp size={16} weight="bold" aria-hidden />
        </button>
        <button
          type="button"
          onClick={act(onMoveDown)}
          disabled={isLast}
          aria-label={`Move ${def.name} down`}
          className={iconBtn}
        >
          <CaretDown size={16} weight="bold" aria-hidden />
        </button>
        <button
          type="button"
          onClick={act(onRemove)}
          aria-label={`Remove ${def.name}`}
          className={iconBtn}
        >
          <Trash size={16} weight="bold" aria-hidden />
        </button>
      </div>
    </div>
  );
}
