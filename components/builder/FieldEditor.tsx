"use client";

import type { Field } from "@/components/blocks/types";
import {
  CaretRight,
  CaretUp,
  CaretDown,
  Trash,
  Plus,
  X,
} from "@phosphor-icons/react/dist/ssr";

/**
 * FieldEditor — a GENERIC, RECURSIVE, CONTROLLED form that edits one block's
 * props from its `fields` schema. Holds NO state for the data it edits: the
 * parent owns `value` and receives every change through `onChange` as a FULL,
 * immutably updated object.
 *
 * Density model (the "boros baris" fix):
 *   - Scalars pack into a 2-column grid; textarea + list span full width.
 *   - List-of-objects items COLLAPSE to a one-line summary (native <details>),
 *     so a 3-tier pricing block reads as 3 rows until you expand one.
 *   - List-of-primitives (e.g. tier features) is a tight column of inputs with
 *     a single remove affordance (reorder dropped — low value, high clutter).
 */

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
const labelCls =
  "font-mono text-[11px] uppercase tracking-wider text-muted-foreground";
const iconBtnCls =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";
const addBtnCls =
  "inline-flex w-fit items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

/** Fresh item for a list-of-objects: text/textarea/select -> "", boolean ->
 * false, nested list -> []. A stable `_id` keys the row across reorder/remove
 * (blocks ignore the extra prop, so it round-trips harmlessly through export). */
function emptyItem(itemFields: Field[]): Record<string, unknown> {
  const next: Record<string, unknown> = { _id: crypto.randomUUID().slice(0, 8) };
  for (const f of itemFields) {
    if (f.type === "boolean") next[f.key] = false;
    else if (f.type === "list") next[f.key] = [];
    else next[f.key] = "";
  }
  return next;
}

/** First non-empty text/textarea value — labels a collapsed item ("Studio"). */
function summaryOf(item: Record<string, unknown>, itemFields: Field[]): string {
  const f = itemFields.find(
    (x) =>
      (x.type === "text" || x.type === "textarea") &&
      typeof item[x.key] === "string" &&
      (item[x.key] as string).trim() !== "",
  );
  return f ? String(item[f.key]) : "";
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

/** Reorder + remove controls for a collapsible object item; lives in the
 * <summary>, so each handler must preventDefault to NOT toggle the disclosure. */
function SummaryControls({
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
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };
  const human = index + 1;
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        className={iconBtnCls}
        onClick={stop(() => onMove(index - 1))}
        disabled={index === 0}
        aria-label={`Move ${noun} ${human} up`}
        title="Move up"
      >
        <CaretUp weight="bold" className="size-3.5" />
      </button>
      <button
        type="button"
        className={iconBtnCls}
        onClick={stop(() => onMove(index + 1))}
        disabled={index === count - 1}
        aria-label={`Move ${noun} ${human} down`}
        title="Move down"
      >
        <CaretDown weight="bold" className="size-3.5" />
      </button>
      <button
        type="button"
        className={iconBtnCls}
        onClick={stop(onRemove)}
        aria-label={`Remove ${noun} ${human}`}
        title="Remove"
      >
        <Trash weight="bold" className="size-3.5" />
      </button>
    </div>
  );
}

/** A list of OBJECTS — each a collapsible <details> with a derived summary. */
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
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <details
          key={(item._id as string) || `i${i}`}
          className="group rounded-lg border border-border bg-muted/30"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 [&::-webkit-details-marker]:hidden">
            <CaretRight
              weight="bold"
              className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
            />
            <span className="min-w-0 flex-1 truncate text-sm">
              {summaryOf(item, itemFields) || `${noun} ${i + 1}`}
            </span>
            <SummaryControls
              index={i}
              count={items.length}
              noun={noun}
              onMove={(to) => onChange(moveAt(items, i, to))}
              onRemove={() => onChange(removeAt(items, i))}
            />
          </summary>
          <div className="border-t border-border px-3 py-3">
            <FieldEditor
              fields={itemFields}
              value={item}
              onChange={(nextItem) => onChange(setAt(items, i, nextItem))}
            />
          </div>
        </details>
      ))}
      <button
        type="button"
        className={addBtnCls}
        onClick={() => onChange([...items, emptyItem(itemFields)])}
      >
        <Plus weight="bold" className="size-4" />
        Add {noun}
      </button>
    </div>
  );
}

/** A list of PRIMITIVES (string[]) — tight inputs, single remove affordance. */
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
    <div className="flex flex-col gap-1.5">
      {items.map((entry, i) => (
        // ponytail: index key is safe here — primitives have no reorder, and
        // remove drops the focused row itself, so no value/focus churn.
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="text"
            className={inputCls}
            value={entry}
            placeholder={placeholder}
            aria-label={`${entryLabel} ${i + 1}`}
            onChange={(e) => onChange(setAt(items, i, e.target.value))}
          />
          <button
            type="button"
            className={iconBtnCls}
            onClick={() => onChange(removeAt(items, i))}
            aria-label={`Remove ${noun} ${i + 1}`}
            title="Remove"
          >
            <X weight="bold" className="size-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className={addBtnCls}
        onClick={() => onChange([...items, ""])}
      >
        <Plus weight="bold" className="size-4" />
        Add {noun}
      </button>
    </div>
  );
}

/** The label + count header shared by both list flavours. */
function ListField({
  field,
  raw,
  onChange,
}: {
  field: Field;
  raw: unknown;
  onChange: (next: unknown) => void;
}): React.JSX.Element {
  const isObjectList = Array.isArray(field.itemFields);
  const arr = Array.isArray(raw) ? raw : [];
  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>
        {field.label}{" "}
        <span className="text-muted-foreground/60">({arr.length})</span>
      </span>
      {isObjectList ? (
        <ObjectList
          field={field}
          items={arr as Record<string, unknown>[]}
          onChange={(next) => onChange(next)}
        />
      ) : (
        <PrimitiveList
          field={field}
          items={(arr as unknown[]).map((v) =>
            typeof v === "string" ? v : String(v ?? ""),
          )}
          onChange={(next) => onChange(next)}
        />
      )}
    </div>
  );
}

/** One scalar field (text / textarea / select / boolean). */
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
    return (
      <label className="flex h-full cursor-pointer items-center gap-2.5 py-1">
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

  // Coerce for DISPLAY without destroying data: a numeric prop shows as "7",
  // not blank, and only real user input ever calls onChange.
  const value = typeof raw === "string" ? raw : raw == null ? "" : String(raw);

  if (field.type === "select") {
    const known = (field.options ?? []).includes(value);
    return (
      <label className="flex flex-col gap-1">
        <span className={labelCls}>{field.label}</span>
        <select
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {/* Keep an unknown stored value selectable so it round-trips. */}
          {!known ? (
            <option value={value}>{value || field.placeholder || "Select…"}</option>
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
      <label className="flex flex-col gap-1">
        <span className={labelCls}>{field.label}</span>
        <textarea
          className={`${inputCls} min-h-[3.75rem] resize-y`}
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
    <label className="flex flex-col gap-1">
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
  const setKey = (key: string, next: unknown) =>
    onChange({ ...value, [key]: next });

  return (
    // Short scalars pack 2-up; textarea + list span the row.
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      {fields.map((field) => {
        const raw = value[field.key];
        const full = field.type === "textarea" || field.type === "list";
        return (
          <div
            key={field.key}
            className={full ? "col-span-2" : "col-span-1 min-w-0"}
          >
            {field.type === "list" ? (
              <ListField
                field={field}
                raw={raw}
                onChange={(next) => setKey(field.key, next)}
              />
            ) : (
              <ScalarField
                field={field}
                raw={raw}
                onChange={(next) => setKey(field.key, next)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
