"use client";

import { useEffect, useRef, useState } from "react";
import {
  REGISTRY,
  DEFAULT_CONFIG,
  createInstance,
} from "@/components/blocks/registry";
import type { BlockInstance, PageConfig } from "@/components/blocks/types";
import FieldEditor from "./FieldEditor";
import BlockPalette from "./BlockPalette";
import CanvasItem from "./CanvasItem";
import Toolbar from "./Toolbar";

const STORAGE_KEY = "portal-builder-config-v1";

// The visual page builder. Owns the PageConfig state; the palette/canvas/
// inspector/toolbar are controlled leaves. Client-side only: autosaves to
// localStorage and exports a portable JSON config (no account, no backend).
// The same config + REGISTRY + BlockRenderer renders identically in templates.
export default function Builder() {
  const [blocks, setBlocks] = useState<BlockInstance[]>(DEFAULT_CONFIG.blocks);
  const [selectedId, setSelectedId] = useState<string | null>(
    DEFAULT_CONFIG.blocks[0]?.id ?? null,
  );
  const [loaded, setLoaded] = useState(false);
  const inspectorRef = useRef<HTMLElement>(null);

  // Restore a saved config on mount (client only) so SSR/hydration match the seed.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PageConfig;
        if (parsed && Array.isArray(parsed.blocks)) {
          setBlocks(parsed.blocks);
          setSelectedId(parsed.blocks[0]?.id ?? null);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  // Autosave once we have loaded (avoid clobbering storage with the seed on mount).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, blocks }));
    } catch {
      // ignore quota errors
    }
  }, [blocks, loaded]);

  // Pull the inspector into view on selection: a no-op on desktop (already
  // sticky-visible), but on mobile it scrolls the edit form into view so the
  // select -> edit loop actually responds.
  useEffect(() => {
    if (selectedId) inspectorRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  const config: PageConfig = { version: 1, blocks };
  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: string) {
    const inst = createInstance(type);
    setBlocks((b) => [...b, inst]);
    setSelectedId(inst.id);
  }

  function updateProps(id: string, props: Record<string, unknown>) {
    setBlocks((b) => b.map((x) => (x.id === id ? { ...x, props } : x)));
  }

  function move(id: string, dir: -1 | 1) {
    setBlocks((b) => {
      const i = b.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const next = [...b];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    setBlocks((b) => b.filter((x) => x.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  }

  function importConfig(c: PageConfig) {
    setBlocks(c.blocks);
    setSelectedId(c.blocks[0]?.id ?? null);
  }

  function reset() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Reset to the starter page? Your changes will be lost.")
    ) {
      return;
    }
    setBlocks(DEFAULT_CONFIG.blocks);
    setSelectedId(DEFAULT_CONFIG.blocks[0]?.id ?? null);
  }

  return (
    <div className="flex flex-col">
      {/* Toolbar sits below the site nav (h-16) */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center px-4">
          <Toolbar config={config} onImport={importConfig} onReset={reset} />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 lg:grid-cols-[220px_1fr_340px]">
        {/* Palette */}
        <aside
          aria-label="Block palette"
          className="border-b border-border p-4 lg:sticky lg:top-[7.5rem] lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r"
        >
          <BlockPalette onAdd={addBlock} />
        </aside>

        {/* Canvas — live preview */}
        <main aria-label="Page preview" className="min-w-0 overflow-x-hidden bg-muted/10">
          {blocks.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center p-10 text-center text-sm text-muted-foreground">
              Empty page. Add a block from the left to start building.
            </div>
          ) : (
            blocks.map((b, i) => {
              const def = REGISTRY[b.type];
              if (!def) return null;
              return (
                <CanvasItem
                  key={b.id}
                  def={def}
                  instance={b}
                  selected={b.id === selectedId}
                  onSelect={() => setSelectedId(b.id)}
                  onMoveUp={() => move(b.id, -1)}
                  onMoveDown={() => move(b.id, 1)}
                  onRemove={() => remove(b.id)}
                  isFirst={i === 0}
                  isLast={i === blocks.length - 1}
                />
              );
            })
          )}
        </main>

        {/* Inspector */}
        <aside
          ref={inspectorRef}
          aria-label="Block inspector"
          className="scroll-mt-[7.5rem] border-t border-border p-4 lg:sticky lg:top-[7.5rem] lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:border-t-0 lg:border-l"
        >
          {selected ? (
            <div>
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="font-mono text-[11px] uppercase tracking-wider text-primary">
                  {REGISTRY[selected.type]?.name ?? selected.type}
                </h2>
                <button
                  type="button"
                  onClick={() => remove(selected.id)}
                  className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
                  Remove
                </button>
              </div>
              <FieldEditor
                key={selected.id}
                fields={REGISTRY[selected.type].fields}
                value={selected.props}
                onChange={(next) => updateProps(selected.id, next)}
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a block in the canvas to edit its content, or add one from
              the left.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
