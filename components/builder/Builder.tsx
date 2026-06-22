"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { ThreeColumnLayoutAdvanced } from "@/components/three-column/ThreeColumnLayout";
import {
  REGISTRY,
  DEFAULT_CONFIG,
  createInstance,
  COLLECTION_ITEM_FIELDS,
} from "@/components/blocks/registry";
import type {
  BlockInstance,
  BuilderPage,
  PageConfig,
} from "@/components/blocks/types";
import FieldEditor from "./FieldEditor";
import BlockPalette from "./BlockPalette";
import CanvasItem from "./CanvasItem";
import Toolbar from "./Toolbar";

type Item = Record<string, unknown>;

const STORAGE_KEY = "portal-builder-config-v1";
const HOME = "home";

// The visual page builder. Owns the PageConfig state; the palette/canvas/
// inspector/toolbar are controlled leaves. Client-side only: autosaves to
// localStorage and exports a portable JSON config (no account, no backend).
// The same config + REGISTRY + BlockRenderer renders identically in templates.
//
// Multi-page: `blocks` is the home page; `pages` are extra pages (e.g.
// /services). The active page's blocks are what the canvas/inspector edit, but
// `collections` are shared across every page, so a home preview block and a
// dedicated page's full block render from one source.
export default function Builder() {
  const [blocks, setBlocks] = useState<BlockInstance[]>(DEFAULT_CONFIG.blocks);
  const [pages, setPages] = useState<BuilderPage[]>(DEFAULT_CONFIG.pages ?? []);
  const [activePageId, setActivePageId] = useState<string>(HOME);
  // Shared named item lists. `collection` blocks read these by name, so a
  // preview block and a full block on the same source stay in sync.
  const [collections, setCollections] = useState<Record<string, Item[]>>(
    DEFAULT_CONFIG.collections ?? {},
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    DEFAULT_CONFIG.blocks[0]?.id ?? null,
  );
  const [loaded, setLoaded] = useState(false);

  // Restore a saved config on mount (client only) so SSR/hydration match the seed.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PageConfig;
        if (parsed && Array.isArray(parsed.blocks)) {
          setBlocks(parsed.blocks);
          setSelectedId(parsed.blocks[0]?.id ?? null);
          if (Array.isArray(parsed.pages)) setPages(parsed.pages);
          if (parsed.collections && typeof parsed.collections === "object") {
            setCollections(parsed.collections as Record<string, Item[]>);
          }
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, blocks, pages, collections }),
      );
    } catch {
      // ignore quota errors
    }
  }, [blocks, pages, collections, loaded]);

  const config: PageConfig = { version: 1, blocks, pages, collections };

  // The blocks of whichever page is being edited.
  const activeBlocks =
    activePageId === HOME
      ? blocks
      : pages.find((p) => p.id === activePageId)?.blocks ?? [];

  // Route a blocks update to either the home page or the active extra page.
  function setActiveBlocks(updater: (b: BlockInstance[]) => BlockInstance[]) {
    if (activePageId === HOME) {
      setBlocks(updater);
    } else {
      setPages((ps) =>
        ps.map((p) =>
          p.id === activePageId ? { ...p, blocks: updater(p.blocks) } : p,
        ),
      );
    }
  }

  const selected = activeBlocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: string) {
    const inst = createInstance(type);
    setActiveBlocks((b) => [...b, inst]);
    setSelectedId(inst.id);
  }

  function updateProps(id: string, props: Record<string, unknown>) {
    setActiveBlocks((b) => b.map((x) => (x.id === id ? { ...x, props } : x)));
  }

  // Replace one named collection's items (shared across every block + page).
  function updateCollection(name: string, items: Item[]) {
    if (!name) return;
    setCollections((c) => ({ ...c, [name]: items }));
  }

  // Items injected into a `collection` block so the canvas matches BlockRenderer.
  function injectedFor(b: BlockInstance): Record<string, unknown> | null {
    return REGISTRY[b.type]?.collection
      ? { items: collections[String(b.props.source ?? "")] ?? [] }
      : null;
  }

  function move(id: string, dir: -1 | 1) {
    setActiveBlocks((b) => {
      const i = b.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= b.length) return b;
      const next = [...b];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(id: string) {
    setActiveBlocks((b) => b.filter((x) => x.id !== id));
    setSelectedId((s) => (s === id ? null : s));
  }

  // --- pages -------------------------------------------------------------
  function switchPage(id: string) {
    setActivePageId(id);
    const target =
      id === HOME ? blocks : pages.find((p) => p.id === id)?.blocks ?? [];
    setSelectedId(target[0]?.id ?? null);
  }

  function addPage() {
    const name = window.prompt("New page name", "About");
    if (!name) return;
    const suggested =
      "/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const path = window.prompt("Path (route)", suggested);
    if (!path) return;
    const id = `page-${crypto.randomUUID().slice(0, 8)}`;
    setPages((ps) => [...ps, { id, name, path, blocks: [] }]);
    setActivePageId(id);
    setSelectedId(null);
  }

  function removePage(id: string) {
    const p = pages.find((x) => x.id === id);
    if (
      p &&
      p.blocks.length > 0 &&
      !window.confirm(`Delete the "${p.name}" page and its ${p.blocks.length} blocks?`)
    ) {
      return;
    }
    setPages((ps) => ps.filter((x) => x.id !== id));
    if (activePageId === id) {
      setActivePageId(HOME);
      setSelectedId(blocks[0]?.id ?? null);
    }
  }

  function importConfig(c: PageConfig) {
    setBlocks(c.blocks);
    setPages((c.pages as BuilderPage[]) ?? []);
    setCollections((c.collections as Record<string, Item[]>) ?? {});
    setActivePageId(HOME);
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
    setPages(DEFAULT_CONFIG.pages ?? []);
    setCollections(DEFAULT_CONFIG.collections ?? {});
    setActivePageId(HOME);
    setSelectedId(DEFAULT_CONFIG.blocks[0]?.id ?? null);
  }

  const tabCls = (id: string) =>
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors " +
    (activePageId === id
      ? "bg-primary text-primary-foreground"
      : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground");

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Chrome: toolbar + page tabs. Fixed height; the panels scroll inside. */}
      <div className="flex-shrink-0">
        <Toolbar config={config} onImport={importConfig} onReset={reset} />

        {/* Page tabs — Home + extra pages share one config + collections. */}
        <div className="flex h-11 items-center gap-1.5 overflow-x-auto border-b border-border px-4">
          <span className="pr-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Pages
          </span>
          <button type="button" onClick={() => switchPage(HOME)} className={tabCls(HOME)}>
            Home
          </button>
          {pages.map((p) => (
            <span
              key={p.id}
              className={
                "inline-flex items-center rounded-lg " +
                (activePageId === p.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground")
              }
            >
              <button
                type="button"
                onClick={() => switchPage(p.id)}
                title={p.path}
                className="py-1.5 pl-3 pr-1.5 text-sm font-medium whitespace-nowrap"
              >
                {p.name}
              </button>
              <button
                type="button"
                onClick={() => removePage(p.id)}
                aria-label={`Delete ${p.name} page`}
                title="Delete page"
                className="pr-2 opacity-70 transition-opacity hover:opacity-100"
              >
                <X weight="bold" className="size-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={addPage}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted-foreground whitespace-nowrap transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Plus weight="bold" className="size-3.5" />
            Page
          </button>
        </div>
      </div>

      {/* Three-column app shell (vendored from resources): collapsible +
          resizable panels, with a bottom inspector drawer on mobile. */}
      <div className="min-h-0 flex-1">
        <ThreeColumnLayoutAdvanced
          tone="feature"
          leftWidth={240}
          rightWidth={360}
          centerMinWidth={320}
          minSideWidth={200}
          maxSideWidth={520}
          resizable
          showCollapseButtons
          persistState
          storageKey="portal-builder-3col"
          leftLabel="Blocks"
          centerLabel="Preview"
          rightLabel="Inspector"
          left={
            <div className="p-4">
              <BlockPalette onAdd={addBlock} />
            </div>
          }
          center={
            <div className="min-h-full bg-muted/10">
              {activeBlocks.length === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center p-10 text-center text-sm text-muted-foreground">
                  Empty page. Add a block from the left to start building.
                </div>
              ) : (
                activeBlocks.map((b, i) => {
                  const def = REGISTRY[b.type];
                  if (!def) return null;
                  return (
                    <CanvasItem
                      key={b.id}
                      def={def}
                      instance={b}
                      injected={injectedFor(b)}
                      selected={b.id === selectedId}
                      onSelect={() => setSelectedId(b.id)}
                      onMoveUp={() => move(b.id, -1)}
                      onMoveDown={() => move(b.id, 1)}
                      onRemove={() => remove(b.id)}
                      isFirst={i === 0}
                      isLast={i === activeBlocks.length - 1}
                    />
                  );
                })
              )}
            </div>
          }
          right={
            <div className="p-4">
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

                  {REGISTRY[selected.type]?.collection ? (
                    <div className="mt-6 border-t border-border pt-4">
                      <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-primary">
                        Shared collection
                        {selected.props.source
                          ? `: ${String(selected.props.source)}`
                          : ""}
                      </p>
                      <p className="mb-3 text-xs text-muted-foreground">
                        Edited once, shared by every block and page using this name.
                      </p>
                      <FieldEditor
                        key={`col-${String(selected.props.source ?? "")}`}
                        fields={[
                          {
                            key: "items",
                            label: "Items",
                            type: "list",
                            itemLabel: "item",
                            itemFields: COLLECTION_ITEM_FIELDS,
                          },
                        ]}
                        value={{
                          items:
                            collections[String(selected.props.source ?? "")] ?? [],
                        }}
                        onChange={(v) =>
                          updateCollection(
                            String(selected.props.source ?? ""),
                            (v.items as Item[]) ?? [],
                          )
                        }
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Select a block in the canvas to edit its content, or add one
                  from the left.
                </p>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
