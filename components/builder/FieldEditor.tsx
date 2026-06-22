"use client";

import type { Field } from "@/components/blocks/types";
import {
  CaretUp,
  CaretDown,
  Trash,
  Plus,
} from "@phosphor-icons/react/dist/ssr";

/**
 * FieldEditor — a GENERIC, RECURSIVE, CONTROLLED form that edits one block's
 * props from its `fields` schema (the same `Field[]` the SSOT registry feeds
 * BlockRenderer). It holds NO state for the data it edits: the parent owns
 * `value` and receives every change through `onChange` as a FULL, immutably
 * updated object. The only thing this tree mutates is its own props — never the
 * caller's object.
 *
 * Recursion shape it must support (the hard case — the "pricing" block):
 *   list(itemFields) -> [ { ..., featured: boolean, features: list(item) } ]
 * i.e. a list of OBJECTS where one member is itself a list of PRIMITIVE strings
 * and another is a boolean. The two list flavours are distinguished by the
 * field schema, NOT the data:
 *   - field.itemFields => array of objects, each edited by a nested FieldEditor.
 *   - field.item       => array of primitives, each edited by the single
 *                         `field.item` Field (whose key is "").
 */

// Shared token classes (mirror the live dev-tool design on this site).
const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
const labelCls =
  "font-mono text-[11px] uppercase tracking-wider text-muted-foreground";
const ghostBtnCls =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-muted disabled:pointer-events-none disabled:opacity-40";
const addBtnCls =
  "inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

/**
 * Derive a fresh, empty item for a list-of-objects from its itemFields:
 * text/textarea/select -> "", boolean -> false, nested list -> [].
 */
function emptyItem(itemFields: Field[]): Record<string, unknown> {
  const next: Record<string, unknown> = {};
  for (const f of itemFields) {
    if (f.type === "boolean") next[f.key] = false;
    else if (f.type === "list") next[f.key] = [];
    else next[f.key] = ""; // text | textarea | select
  }
  return next;
}

/** Immutable array helpers — never touch the source array. */
function setAt<T>(arr: T[], index: number, item: T): T[] {
  const next = arr.slice();
  next[index] = item;
  return next;
}
function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}
function moveAt<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Per-item reorder + remove controls, reused by both list flavours. */
function ItemControls({
  index,
  count,
  onMove,
  onRemove,
  noun,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
  noun: string;
}): React.JSX.Element {
  const human = index + 1;
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={ghostBtnCls}
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label={`Move ${noun} ${human} up`}
      >
        <CaretUp weight="bold" className="size-3.5" />
      </button>
      <button
        type="button"
        className={ghostBtnCls}
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label={`Move ${noun} ${human} down`}
      >
        <CaretDown weight="bold" className="size-3.5" />
      </button>
      <button
        type="button"
        className={ghostBtnCls}
        onClick={onRemove}
        aria-label={`Remove ${noun} ${human}`}
      >
        <Trash weight="bold" className="size-3.5" />
      </button>
    </div>
  );
}

/** A list of OBJECTS — each rendered with a nested recursive FieldEditor. */
function ObjectList({
  field,
  items,
  onChange,
}: {
  field: Field;
  items: Record<string, unknown>[];
  onChange: (next: Record<string, unknown>[]) => void;
}): React.JSX.Element {
  const itemFields = field.itemFields ?? [];
  const noun = field.itemLabel ?? "item";
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/30 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className={labelCls}>
              {noun} {i + 1}
            </span>
            <ItemControls
              index={i}
              count={items.length}
              noun={noun}
              onMove={(to) => onChange(moveAt(items, i, to))}
              onRemove={() => onChange(removeAt(items, i))}
            />
          </div>
          <FieldEditor
            fields={itemFields}
            value={item}
            onChange={(nextItem) => onChange(setAt(items, i, nextItem))}
          />
        </div>
      ))}
      <div>
        <button
          type="button"
          className={addBtnCls}
          onClick={() => onChange([...items, emptyItem(itemFields)])}
        >
          <Plus weight="bold" className="size-4" />
          Add {noun}
        </button>
      </div>
    </div>
  );
}

/** A list of PRIMITIVES (e.g. string[]) — each edited by `field.item`. */
function PrimitiveList({
  field,
  items,
  onChange,
}: {
  field: Field;
  items: string[];
  onChange: (next: string[]) => void;
}): React.JSX.Element {
  const noun = field.itemLabel ?? "item";
  const placeholder = field.item?.placeholder;
  const entryLabel = field.item?.label ?? "Value";
  return (
    <div className="flex flex-col gap-2">
      {items.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className={inputCls}
            value={entry}
            placeholder={placeholder}
            aria-label={`${entryLabel} ${i + 1}`}
            onChange={(e) => onChange(setAt(items, i, e.target.value))}
          />
          <ItemControls
            index={i}
            count={items.length}
            noun={noun}
            onMove={(to) => onChange(moveAt(items, i, to))}
            onRemove={() => onChange(removeAt(items, i))}
          />
        </div>
      ))}
      <div>
        <button
          type="button"
          className={addBtnCls}
          onClick={() => onChange([...items, ""])}
        >
          <Plus weight="bold" className="size-4" />
          Add {noun}
        </button>
      </div>
    </div>
  );
}

/** Render one scalar field (text / textarea / select / boolean). */
function ScalarField({
  field,
  raw,
  onChange,
}: {
  field: Field;
  raw: unknown;
  onChange: (next: unknown) => void;
}): React.JSX.Element {
  if (field.type === "boolean") {
    // Checkbox owns its own <label> wrapper for an accessible hit target.
    return (
      <label className="flex cursor-pointer items-center gap-2.5 py-1">
        <input
          type="checkbox"
          className="size-4 rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          checked={Boolean(raw)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm text-foreground">{field.label}</span>
      </label>
    );
  }

  const value = typeof raw === "string" ? raw : "";

  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{field.label}</span>
        <select
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {/* An empty placeholder option keeps a never-set select valid. */}
          {!field.options?.includes(value) ? (
            <option value="">{field.placeholder ?? "Select…"}</option>
          ) : null}
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>{field.label}</span>
        <textarea
          className={`${inputCls} min-h-[4.5rem] resize-y`}
          rows={3}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }

  // text (default)
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{field.label}</span>
      <input
        type="text"
        className={inputCls}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function FieldEditor({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}): React.JSX.Element {
  // Set one key immutably, then emit the FULL updated object.
  const setKey = (key: string, next: unknown) =>
    onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const raw = value[field.key];

        if (field.type === "list") {
          // A list-of-objects (itemFields) is bordered + recursively edited; a
          // list-of-primitives (item) is a flat column of inputs. The schema,
          // not the data, decides which.
          const isObjectList = Array.isArray(field.itemFields);
          return (
            <div
              key={field.key}
              className="flex flex-col gap-2 border-l border-border pl-3"
            >
              <span className={labelCls}>{field.label}</span>
              {isObjectList ? (
                <ObjectList
                  field={field}
                  items={Array.isArray(raw) ? (raw as Record<string, unknown>[]) : []}
                  onChange={(next) => setKey(field.key, next)}
                />
              ) : (
                <PrimitiveList
                  field={field}
                  items={
                    Array.isArray(raw)
                      ? (raw as unknown[]).map((v) => (typeof v === "string" ? v : String(v ?? "")))
                      : []
                  }
                  onChange={(next) => setKey(field.key, next)}
                />
              )}
            </div>
          );
        }

        return (
          <ScalarField
            key={field.key}
            field={field}
            raw={raw}
            onChange={(next) => setKey(field.key, next)}
          />
        );
      })}
    </div>
  );
}
