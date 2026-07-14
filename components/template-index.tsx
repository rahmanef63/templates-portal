"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Rows, GridFour } from "@phosphor-icons/react";
import type { Template } from "@/lib/content";

type Labels = {
  eyebrow: string;
  title: string;
  aside: string;
  readEntry: string;
  viewList: string;
  viewGallery: string;
};

type View = "list" | "gallery";

// The Index, with a List ↔ Gallery view toggle. Data comes from the server page;
// this island only owns the `view` toggle. Both views reuse the same editorial
// classes (`reveal` scroll-in, `plate` grayscale→color hover) so nothing about
// the look or motion changes — the gallery just leads with the thumbnail.
export function TemplateIndex({ templates, labels }: { templates: Template[]; labels: Labels }) {
  const [view, setView] = useState<View>("list");

  return (
    <section id="index" className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
      <div className="flex flex-col gap-4 border-t-2 border-[var(--rule)] pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">{labels.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.01em] sm:text-4xl">{labels.title}</h2>
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          <p className="max-w-sm font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
            {labels.aside}
          </p>
          <div className="inline-flex self-start border border-border sm:self-end" role="group" aria-label={`${labels.viewList} / ${labels.viewGallery}`}>
            <ViewButton icon={Rows} label={labels.viewList} active={view === "list"} onClick={() => setView("list")} />
            <ViewButton icon={GridFour} label={labels.viewGallery} active={view === "gallery"} onClick={() => setView("gallery")} first={false} />
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="index-list mt-8">
          {templates.map((tpl) => (
            <Link
              key={tpl.slug}
              href={`/t/${tpl.slug}`}
              className="index-row reveal group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-5 border-t border-border py-8 transition-[padding] duration-300 hover:pl-3 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10 sm:py-10"
            >
              <span className="index-num font-display text-4xl italic leading-none text-muted-foreground transition-colors group-hover:text-primary sm:text-6xl" />

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground sm:text-4xl">
                    {tpl.title}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {tpl.vertical}
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {tpl.features.slice(0, 3).map((f) => (
                    <li key={f} className="before:mr-2 before:text-primary before:content-['/']">
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  {labels.readEntry}
                  <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>

              <figure className="plate col-span-2 overflow-hidden border border-border bg-muted sm:col-span-1 sm:w-64">
                <div className="relative aspect-[40/21]">
                  <Image
                    src={tpl.thumb}
                    alt={`${tpl.title} preview`}
                    fill
                    sizes="(min-width:640px) 256px, 100vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
              </figure>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Link
              key={tpl.slug}
              href={`/t/${tpl.slug}`}
              className="reveal group flex flex-col border border-border bg-background transition-transform duration-300 hover:-translate-y-1"
            >
              <figure className="plate overflow-hidden border-b border-border bg-muted">
                <div className="relative aspect-[40/21]">
                  <Image
                    src={tpl.thumb}
                    alt={`${tpl.title} preview`}
                    fill
                    sizes="(min-width:1024px) 384px, (min-width:640px) 50vw, 100vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
              </figure>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-medium tracking-[-0.01em] text-foreground sm:text-2xl">
                  {tpl.title}
                </h3>
                <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {tpl.vertical}
                </span>
                <span className="mt-auto pt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  {labels.readEntry}
                  <ArrowRight weight="bold" className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function ViewButton({
  icon: Icon,
  label,
  active,
  onClick,
  first = true,
}: {
  icon: typeof Rows;
  label: string;
  active: boolean;
  onClick: () => void;
  first?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
        first ? "" : "border-l border-border"
      } ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      <Icon weight="bold" className="size-3.5" />
      {label}
    </button>
  );
}
