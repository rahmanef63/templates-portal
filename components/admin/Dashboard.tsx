"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  ArrowUp,
  ArrowDown,
  PencilSimple,
  Trash,
  Plus,
  CircleNotch,
  SignOut,
  Check,
} from "@phosphor-icons/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const input =
  "h-10 w-full rounded-md border border-border-strong bg-background px-3 text-sm outline-none focus:border-accent";
const label = "text-[13px] font-medium text-muted-foreground";
const btnPrimary =
  "inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50";
const btnGhost =
  "inline-flex h-9 items-center gap-1.5 rounded-md border border-border-strong bg-background px-3 text-sm font-medium transition hover:bg-muted";
const iconBtn =
  "grid size-8 place-items-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30";

type TemplateValues = {
  slug: string;
  title: string;
  vertical: string;
  blurb: string;
  demo: string;
  repo: string;
  thumb: string;
  features: string[];
};

const EMPTY: TemplateValues = {
  slug: "",
  title: "",
  vertical: "",
  blurb: "",
  demo: "",
  repo: "",
  thumb: "",
  features: [],
};

function TemplateForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: TemplateValues;
  onSave: (v: TemplateValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [v, setV] = useState<TemplateValues>(initial);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof TemplateValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSave({ ...v, features: v.features.filter(Boolean) });
        setBusy(false);
      }}
      className="grid gap-3 rounded-lg border border-border bg-background-subtle p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className={label}>Title</span>
          <input required value={v.title} onChange={set("title")} className={`mt-1 ${input}`} />
        </div>
        <div>
          <span className={label}>Vertical</span>
          <input value={v.vertical} onChange={set("vertical")} className={`mt-1 ${input}`} />
        </div>
        <div>
          <span className={label}>Slug</span>
          <input required value={v.slug} onChange={set("slug")} className={`mt-1 ${input}`} />
        </div>
        <div>
          <span className={label}>Thumbnail path</span>
          <input value={v.thumb} onChange={set("thumb")} placeholder="/thumbs/x.webp" className={`mt-1 ${input}`} />
        </div>
        <div>
          <span className={label}>Demo URL</span>
          <input value={v.demo} onChange={set("demo")} className={`mt-1 ${input}`} />
        </div>
        <div>
          <span className={label}>Repo URL</span>
          <input value={v.repo} onChange={set("repo")} className={`mt-1 ${input}`} />
        </div>
      </div>
      <div>
        <span className={label}>Blurb</span>
        <textarea
          value={v.blurb}
          onChange={set("blurb")}
          rows={2}
          className={`mt-1 min-h-[64px] w-full rounded-md border border-border-strong bg-background px-3 py-2 text-sm outline-none focus:border-accent`}
        />
      </div>
      <div>
        <span className={label}>Features (one per line)</span>
        <textarea
          value={v.features.join("\n")}
          onChange={(e) => setV((p) => ({ ...p, features: e.target.value.split("\n") }))}
          rows={4}
          className={`mt-1 min-h-[96px] w-full rounded-md border border-border-strong bg-background px-3 py-2 font-mono text-[13px] outline-none focus:border-accent`}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={busy} className={btnPrimary}>
          {busy ? <CircleNotch className="size-4 animate-spin" /> : <Check weight="bold" className="size-4" />}
          Save
        </button>
        <button type="button" onClick={onCancel} className={btnGhost}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function SettingsCard() {
  const s = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [saved, setSaved] = useState(false);
  if (s === undefined) return null;

  const fields: [keyof NonNullable<typeof s>, string][] = [
    ["siteName", "Site name"],
    ["makerName", "Maker name"],
    ["makerRole", "Maker role"],
    ["makerHandle", "GitHub handle"],
    ["makerSite", "Portfolio URL"],
    ["makerGithub", "GitHub URL"],
    ["makerResources", "Resources URL"],
  ];

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const args: Record<string, string> = {};
        for (const [k] of fields) args[k] = String(fd.get(k) ?? "");
        args.siteDesc = String(fd.get("siteDesc") ?? "");
        await upsert(args);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }}
      className="rounded-xl border border-border bg-background p-6 shadow-[var(--shadow-card)]"
    >
      <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Site & maker</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {fields.map(([k, lbl]) => (
          <div key={k}>
            <span className={label}>{lbl}</span>
            <input name={k} defaultValue={(s?.[k] as string) ?? ""} className={`mt-1 ${input}`} />
          </div>
        ))}
      </div>
      <div className="mt-3">
        <span className={label}>Site description</span>
        <textarea
          name="siteDesc"
          defaultValue={s?.siteDesc ?? ""}
          rows={2}
          className="mt-1 min-h-[64px] w-full rounded-md border border-border-strong bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <button type="submit" className={`mt-4 ${btnPrimary}`}>
        {saved ? <Check weight="bold" className="size-4" /> : null}
        {saved ? "Saved" : "Save settings"}
      </button>
    </form>
  );
}

export default function Dashboard() {
  const { signOut } = useAuthActions();
  const templates = useQuery(api.templates.list);
  const create = useMutation(api.templates.create);
  const update = useMutation(api.templates.update);
  const remove = useMutation(api.templates.remove);
  const reorder = useMutation(api.templates.reorder);

  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function move(index: number, dir: -1 | 1) {
    if (!templates) return;
    const j = index + dir;
    if (j < 0 || j >= templates.length) return;
    const ids = templates.map((t) => t._id);
    [ids[index], ids[j]] = [ids[j], ids[index]];
    await reorder({ ids });
  }

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">Content</h1>
          <p className="text-[13px] text-faint">
            Edits go live on the public site immediately.{" "}
            <Link href="/" className="text-accent hover:underline">
              View site ↗
            </Link>
          </p>
        </div>
        <button onClick={() => signOut()} className={btnGhost}>
          <SignOut weight="bold" className="size-4" />
          Sign out
        </button>
      </div>

      <SettingsCard />

      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em]">
          Templates {templates ? `(${templates.length})` : ""}
        </h2>
        <button onClick={() => setAdding((a) => !a)} className={btnPrimary}>
          <Plus weight="bold" className="size-4" />
          Add template
        </button>
      </div>

      {adding ? (
        <div className="mb-4">
          <TemplateForm
            initial={EMPTY}
            onCancel={() => setAdding(false)}
            onSave={async (v) => {
              await create(v);
              setAdding(false);
            }}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        {templates?.map((t, i) => (
          <div key={t._id} className="rounded-lg border border-border bg-background">
            <div className="flex items-center gap-3 p-3">
              <div className="flex flex-col">
                <button className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp weight="bold" className="size-3.5" />
                </button>
                <button
                  className={iconBtn}
                  disabled={i === templates.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Move down"
                >
                  <ArrowDown weight="bold" className="size-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{t.title}</p>
                <p className="truncate text-[13px] text-faint">{t.vertical}</p>
              </div>
              <button
                className={iconBtn}
                onClick={() => setEditing(editing === t._id ? null : t._id)}
                aria-label="Edit"
              >
                <PencilSimple weight="bold" className="size-4" />
              </button>
              <button
                className={iconBtn}
                onClick={() => {
                  if (confirm(`Delete "${t.title}"?`)) remove({ id: t._id as Id<"templates"> });
                }}
                aria-label="Delete"
              >
                <Trash weight="bold" className="size-4" />
              </button>
            </div>
            {editing === t._id ? (
              <div className="border-t border-border p-3">
                <TemplateForm
                  initial={{
                    slug: t.slug,
                    title: t.title,
                    vertical: t.vertical,
                    blurb: t.blurb,
                    demo: t.demo,
                    repo: t.repo,
                    thumb: t.thumb,
                    features: t.features,
                  }}
                  onCancel={() => setEditing(null)}
                  onSave={async (v) => {
                    await update({ id: t._id as Id<"templates">, ...v });
                    setEditing(null);
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
