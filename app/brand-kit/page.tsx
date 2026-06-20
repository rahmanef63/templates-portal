"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/**
 * BRAND KIT editor — a stateless, client-side form that produces a single JSON
 * object whose shape matches the templates' `siteSettings` singleton, so it
 * imports cleanly via `settings.upsert` in any template's dashboard.
 *
 * Contract notes (load-bearing):
 *  - Top-level keys map 1:1 to `settings.upsert` args (all optional strings).
 *  - `socials` is exported as a JSON *string* (the schema stores it as
 *    `v.optional(v.string())`), with keys: twitter, linkedin, github,
 *    youtube, instagram.
 */

type Socials = {
  twitter: string;
  linkedin: string;
  github: string;
  youtube: string;
  instagram: string;
};

type Form = {
  siteName: string;
  ownerName: string;
  tagline: string;
  seoDescription: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
  faviconUrl: string;
  brandColor: string;
  themePreset: string;
  socials: Socials;
};

const EMPTY: Form = {
  siteName: "",
  ownerName: "",
  tagline: "",
  seoDescription: "",
  contactEmail: "",
  contactPhone: "",
  logoUrl: "",
  faviconUrl: "",
  brandColor: "#6366f1",
  themePreset: "system",
  socials: {
    twitter: "",
    linkedin: "",
    github: "",
    youtube: "",
    instagram: "",
  },
};

const THEME_PRESETS = ["system", "light", "dark"] as const;

/**
 * Build the export object. Keys match `settings.upsert` args exactly so the
 * downloaded file imports cleanly. Empty fields are omitted (upsert only
 * patches provided fields), and `socials` is serialized to a JSON string.
 */
function buildSiteSettings(f: Form): Record<string, string> {
  const out: Record<string, string> = {};
  const put = (key: string, value: string) => {
    const v = value.trim();
    if (v) out[key] = v;
  };

  put("siteName", f.siteName);
  put("ownerName", f.ownerName);
  put("tagline", f.tagline);
  put("seoDescription", f.seoDescription);
  put("contactEmail", f.contactEmail);
  put("contactPhone", f.contactPhone);
  put("logoUrl", f.logoUrl);
  put("faviconUrl", f.faviconUrl);
  put("brandColor", f.brandColor);
  put("themePreset", f.themePreset);

  const socials: Record<string, string> = {};
  for (const [k, v] of Object.entries(f.socials)) {
    const trimmed = v.trim();
    if (trimmed) socials[k] = trimmed;
  }
  if (Object.keys(socials).length) {
    // Schema stores socials as a JSON string — serialize so upsert accepts it.
    out.socials = JSON.stringify(socials);
  }

  return out;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary";

export default function BrandKitPage() {
  const [f, setF] = useState<Form>(EMPTY);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setF((p) => ({ ...p, [key]: value }));

  const setSocial = (key: keyof Socials, value: string) =>
    setF((p) => ({ ...p, socials: { ...p.socials, [key]: value } }));

  const exportObj = useMemo(() => buildSiteSettings(f), [f]);
  const json = useMemo(() => JSON.stringify(exportObj, null, 2), [exportObj]);

  function download() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brand-kit.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <header className="mb-10">
        <p className="mb-3 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Stateless · Client-side only
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Brand Kit
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Fill in your brand once, then download a portable{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            brand-kit.json
          </code>{" "}
          and import it into any template&apos;s dashboard. It maps directly to
          your <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            siteSettings
          </code>
          . Nothing is uploaded — your data stays in your browser, then in{" "}
          <em>your</em> Convex.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Form */}
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Identity */}
          <fieldset className="rounded-xl border border-border bg-background p-6">
            <legend className="px-2 text-sm font-semibold">Identity</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Site name">
                <input
                  className={inputCls}
                  value={f.siteName}
                  onChange={(e) => set("siteName", e.target.value)}
                  placeholder="Acme Studio"
                />
              </Field>
              <Field label="Owner name">
                <input
                  className={inputCls}
                  value={f.ownerName}
                  onChange={(e) => set("ownerName", e.target.value)}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Tagline" hint="A short one-liner.">
                <input
                  className={inputCls}
                  value={f.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  placeholder="Design that ships."
                />
              </Field>
              <Field
                label="Bio / SEO description"
                hint="Used for meta description and your about blurb."
              >
                <textarea
                  className={`${inputCls} min-h-[2.5rem] resize-y`}
                  rows={2}
                  value={f.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  placeholder="We build branded sites for modern teams."
                />
              </Field>
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset className="rounded-xl border border-border bg-background p-6">
            <legend className="px-2 text-sm font-semibold">Contact</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact email">
                <input
                  type="email"
                  className={inputCls}
                  value={f.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                  placeholder="hello@acme.com"
                />
              </Field>
              <Field label="Contact phone">
                <input
                  className={inputCls}
                  value={f.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  placeholder="+1 555 0100"
                />
              </Field>
            </div>
          </fieldset>

          {/* Brand assets & theme */}
          <fieldset className="rounded-xl border border-border bg-background p-6">
            <legend className="px-2 text-sm font-semibold">
              Brand assets &amp; theme
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Logo URL">
                <input
                  className={inputCls}
                  value={f.logoUrl}
                  onChange={(e) => set("logoUrl", e.target.value)}
                  placeholder="https://…/logo.svg"
                />
              </Field>
              <Field label="Favicon URL">
                <input
                  className={inputCls}
                  value={f.faviconUrl}
                  onChange={(e) => set("faviconUrl", e.target.value)}
                  placeholder="https://…/favicon.ico"
                />
              </Field>
              <Field label="Brand color (hex)">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label="Brand color picker"
                    className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-background p-1"
                    value={/^#[0-9a-fA-F]{6}$/.test(f.brandColor) ? f.brandColor : "#6366f1"}
                    onChange={(e) => set("brandColor", e.target.value)}
                  />
                  <input
                    className={inputCls}
                    value={f.brandColor}
                    onChange={(e) => set("brandColor", e.target.value)}
                    placeholder="#6366f1"
                  />
                </div>
              </Field>
              <Field label="Theme preset">
                <select
                  className={inputCls}
                  value={f.themePreset}
                  onChange={(e) => set("themePreset", e.target.value)}
                >
                  {THEME_PRESETS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </fieldset>

          {/* Socials */}
          <fieldset className="rounded-xl border border-border bg-background p-6">
            <legend className="px-2 text-sm font-semibold">Socials</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              {(
                [
                  ["twitter", "Twitter / X"],
                  ["linkedin", "LinkedIn"],
                  ["github", "GitHub"],
                  ["youtube", "YouTube"],
                  ["instagram", "Instagram"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    className={inputCls}
                    value={f.socials[key]}
                    onChange={(e) => setSocial(key, e.target.value)}
                    placeholder={`https://…/${key}`}
                  />
                </Field>
              ))}
            </div>
          </fieldset>
        </form>

        {/* Sidebar: preview + actions + how-to */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-background p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Live JSON preview</h2>
              <span className="text-xs text-muted-foreground">
                {Object.keys(exportObj).length} field
                {Object.keys(exportObj).length === 1 ? "" : "s"}
              </span>
            </div>
            <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
              <code>{json}</code>
            </pre>
            <button
              type="button"
              onClick={download}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Download brand-kit.json
            </button>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-5">
            <h2 className="text-sm font-semibold">How to use it</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-muted-foreground">
              <li>
                In each template&apos;s dashboard, go to{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  /dashboard/admin/settings
                </code>{" "}
                and import this JSON.
              </li>
              <li>
                It maps to your{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  siteSettings
                </code>{" "}
                — fill your brand once, reuse across all your templates.
              </li>
              <li>
                Your data stays in <em>your</em> Convex; the portal never stores
                it.
              </li>
            </ol>
            <Link
              href="/docs/setup"
              className="mt-4 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Read the setup guide →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
