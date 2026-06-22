"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  DownloadSimple,
  Copy,
  Check,
  UploadSimple,
  ArrowCounterClockwise,
  X,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import type { PageConfig } from "@/components/blocks/types";

// Builder top toolbar. CONTROLLED: the parent owns `config`; this component
// holds ONLY transient UI state (import popover open, copied flag, parse error,
// pasted text). Export / import / reset all flow through props.

interface ToolbarProps {
  config: PageConfig;
  onImport: (config: PageConfig) => void;
  onReset: () => void;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Structural guard: a PageConfig must be a non-null object whose `blocks` is an
// array, and every block must be a non-null object with a string `type` and a
// non-null `props` object. This keeps garbage out of BlockRenderer while still
// accepting any `version` (we normalize it to 1 on commit).
function isPageConfigShape(value: unknown): value is PageConfig {
  if (!isPlainObject(value)) return false;
  const { blocks } = value;
  if (!Array.isArray(blocks)) return false;
  return blocks.every(
    (block) =>
      isPlainObject(block) &&
      typeof block.type === "string" &&
      isPlainObject(block.props),
  );
}

export default function Toolbar({
  config,
  onImport,
  onReset,
}: ToolbarProps): React.JSX.Element {
  const [importOpen, setImportOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the "Copied" badge after a short beat. Cleared on unmount.
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const serialized = () => JSON.stringify(config, null, 2);

  function handleExport() {
    const blob = new Blob([serialized()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portal-page.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serialized());
      setCopied(true);
    } catch {
      // Clipboard can be blocked (insecure context / permissions). Stay quiet:
      // the user still has Export JSON as a reliable path.
      setCopied(false);
    }
  }

  function openImport() {
    setImportError(null);
    setImportOpen(true);
  }

  function closeImport() {
    setImportOpen(false);
    setPasted("");
    setImportError(null);
  }

  // Shared parse + validate + commit path for both the textarea and the file.
  function tryImport(raw: string) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setImportError("That is not valid JSON. Check for a stray comma or quote.");
      return;
    }
    if (!isPlainObject(parsed) || !Array.isArray(parsed.blocks)) {
      setImportError('Expected an object with a "blocks" array.');
      return;
    }
    if (!isPageConfigShape(parsed)) {
      setImportError('Each block needs a string "type" and a "props" object.');
      return;
    }
    onImport({ ...parsed, version: 1 });
    closeImport();
  }

  function handleSubmitPasted() {
    const raw = pasted.trim();
    if (!raw) {
      setImportError("Paste some JSON, or choose a file below.");
      return;
    }
    tryImport(raw);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later by clearing the input value.
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => tryImport(String(reader.result ?? ""));
    reader.onerror = () => setImportError("Could not read that file.");
    reader.readAsText(file);
  }

  const btnBase =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";
  const btnFilled = `${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`;
  const btnGhost = `${btnBase} border border-border text-foreground hover:border-primary/50 hover:bg-muted`;

  return (
    <div className="relative border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          Page builder
        </p>

        <div className="flex items-center gap-2">
          <button type="button" onClick={handleExport} className={btnFilled}>
            <DownloadSimple weight="bold" className="size-4" />
            Export JSON
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className={btnGhost}
            aria-live="polite"
          >
            {copied ? (
              <Check weight="bold" className="size-4 text-primary" />
            ) : (
              <Copy weight="bold" className="size-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={importOpen ? closeImport : openImport}
            className={btnGhost}
            aria-haspopup="dialog"
            aria-expanded={importOpen}
          >
            <UploadSimple weight="bold" className="size-4" />
            Import
          </button>

          <button type="button" onClick={onReset} className={btnGhost}>
            <ArrowCounterClockwise weight="bold" className="size-4" />
            Reset
          </button>
        </div>
      </div>

      {importOpen ? (
        <div
          role="dialog"
          aria-label="Import page configuration"
          className="absolute right-4 top-full z-20 mt-2 w-[min(28rem,calc(100vw-2rem))] rounded-xl border border-border bg-background p-4 shadow-xl shadow-black/20 sm:right-6"
        >
          <div className="flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Import config
            </p>
            <button
              type="button"
              onClick={closeImport}
              aria-label="Close import panel"
              className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <X weight="bold" className="size-4" />
            </button>
          </div>

          <label
            htmlFor="builder-import-json"
            className="mt-3 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
          >
            Paste JSON
          </label>
          <textarea
            id="builder-import-json"
            value={pasted}
            onChange={(e) => {
              setPasted(e.target.value);
              if (importError) setImportError(null);
            }}
            rows={6}
            spellCheck={false}
            placeholder='{ "version": 1, "blocks": [] }'
            aria-invalid={Boolean(importError)}
            aria-describedby="builder-import-error"
            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          />

          {importError ? (
            <p
              id="builder-import-error"
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-xs text-red-400"
            >
              <Warning weight="bold" className="mt-0.5 size-3.5 shrink-0" />
              <span>{importError}</span>
            </p>
          ) : null}

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={btnGhost}
            >
              <UploadSimple weight="bold" className="size-4" />
              Upload file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFile}
              className="sr-only"
              aria-label="Upload a JSON config file"
            />

            <button
              type="button"
              onClick={handleSubmitPasted}
              className={btnFilled}
            >
              Load
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
