import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { TEMPLATES } from "@/data/templates";
import { SITE_URL, SITE_NAME, SITE_DESC, MAKER } from "./site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: SITE_NAME,
  description: SITE_DESC,
  url: SITE_URL,
  numberOfItems: TEMPLATES.length,
  itemListElement: TEMPLATES.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.title,
    description: t.blurb,
    url: t.demo || `${SITE_URL}/t/${t.slug}`,
  })),
};

// Typed CSS custom property for the staggered load-in delay.
const delay = (i: number) => ({ "--i": i }) as CSSProperties;

export default function HomePage() {
  const lead = TEMPLATES[0];
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO — asymmetric editorial split, art-directed staggered first paint. */}
      <section className="border-b-2 border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-10 pt-14 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-20 lg:pb-24">
            <div className="flex flex-col">
              <p className="load-in font-mono text-xs uppercase tracking-[0.28em] text-primary" style={delay(0)}>
                The curated index
              </p>
              <h1
                className="load-in mt-6 font-display font-normal leading-[0.98] tracking-[-0.02em] text-foreground text-[clamp(2.75rem,7vw,5.25rem)]"
                style={delay(1)}
              >
                Production templates you clone, brand &amp;{" "}
                <em className="font-normal italic text-primary">ship.</em>
              </h1>
              <p
                className="load-in mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
                style={delay(2)}
              >
                Real Next.js&nbsp;16 + Convex apps across {TEMPLATES.length} verticals.
                Set your Brand Kit once, drop it into any template, and deploy a branded
                site in minutes.
              </p>
              <div className="load-in mt-10 flex flex-wrap items-center gap-6" style={delay(3)}>
                <a
                  href="#index"
                  className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Browse the index
                  <ArrowRight weight="bold" className="size-4" />
                </a>
                <Link
                  href="/brand-kit"
                  className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground"
                >
                  <span className="border-b border-primary pb-1">Build your Brand Kit</span>
                  <ArrowUpRight
                    weight="bold"
                    className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Editorial plate — the lead template printed as a framed figure. */}
            <figure className="load-in relative hidden self-end lg:block" style={delay(4)}>
              <div className="overflow-hidden border border-[var(--rule)] bg-muted">
                <Image
                  src={lead.thumb}
                  alt={`${lead.title} preview`}
                  width={1600}
                  height={840}
                  priority
                  className="w-full grayscale-[0.15] contrast-[1.02]"
                />
              </div>
              <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span>Fig. 01 — {lead.vertical}</span>
                <a href={lead.demo} className="text-primary">
                  Live demo ↗
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* THE INDEX — templates as a magazine table of contents, numbered 00–06. */}
      <section id="index" className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-3 border-t-2 border-[var(--rule)] pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              The Index — {String(TEMPLATES.length).padStart(2, "0")} entries
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.01em] sm:text-4xl">
              Every template, one contents page
            </h2>
          </div>
          <p className="max-w-sm font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
            Production-ready · one vertical each · open an entry for features, live demo &amp; repo
          </p>
        </div>

        <div className="index-list mt-8">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              href={`/t/${t.slug}`}
              className="index-row reveal group grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-5 border-t border-border py-8 transition-[padding] duration-300 hover:pl-3 sm:grid-cols-[auto_1fr_auto] sm:gap-x-10 sm:py-10"
            >
              <span className="index-num font-display text-4xl italic leading-none text-muted-foreground transition-colors group-hover:text-primary sm:text-6xl" />

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-2xl font-medium tracking-[-0.01em] text-foreground sm:text-4xl">
                    {t.title}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t.vertical}
                  </span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t.features.slice(0, 3).map((f) => (
                    <li key={f} className="before:mr-2 before:text-primary before:content-['/']">
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">
                  Read the entry
                  <ArrowRight
                    weight="bold"
                    className="size-3.5 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>

              <figure className="plate col-span-2 overflow-hidden border border-border bg-muted sm:col-span-1 sm:w-64">
                <div className="relative aspect-[40/21]">
                  <Image
                    src={t.thumb}
                    alt={`${t.title} preview`}
                    fill
                    sizes="(min-width:640px) 256px, 100vw"
                    className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
              </figure>
            </Link>
          ))}
        </div>
      </section>

      {/* TOOLKIT — Brand Kit + Setup as two editorial rows (not part of the index). */}
      <section className="border-t-2 border-[var(--rule)] bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
            The Toolkit
          </p>
          <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <div className="flex flex-col bg-background p-8 lg:p-10">
              <h3 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">
                Brand Kit
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                Define your colors, fonts, logo, and voice once. Export a portable Brand
                Kit and drop it into any template — entirely client-side, no account.
              </p>
              <Link
                href="/brand-kit"
                className="mt-8 inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Open Brand Kit
                <ArrowRight weight="bold" className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col bg-background p-8 lg:p-10">
              <h3 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">
                Setup in one command
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                Clone, install, run. Every template follows the same setup flow — follow
                the guide to go from repo to live site fast.
              </p>
              <Link
                href="/docs/setup"
                className="group mt-8 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
              >
                <span className="border-b border-primary pb-1">Read the setup guide</span>
                <ArrowUpRight
                  weight="bold"
                  className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COLOPHON — the maker, print contributor-bio treatment with a drop-cap. */}
      <section className="border-t-2 border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
            Colophon — About the maker
          </p>
          <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                Built by <span className="italic text-primary">Rahman&nbsp;Effendi</span>
              </h2>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {MAKER.role}
              </p>
              <dl className="mt-10 space-y-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-[0.14em]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Portfolio</dt>
                  <dd>
                    <a href={MAKER.site} className="border-b border-primary pb-0.5 hover:text-primary">
                      rahmanef.com ↗
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Source</dt>
                  <dd>
                    <a href={MAKER.github} className="border-b border-primary pb-0.5 hover:text-primary">
                      github.com/{MAKER.handle} ↗
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Knowledge</dt>
                  <dd>
                    <a href={MAKER.resources} className="border-b border-primary pb-0.5 hover:text-primary">
                      resource.rahmanef.com ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-20">
              <p className="font-display text-2xl leading-[1.5] text-foreground first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-7xl first-letter:font-medium first-letter:leading-[0.7] first-letter:text-primary sm:text-[1.7rem]">
                I ship a fleet of production Next.js&nbsp;16 + Convex templates and
                rahman-resources, a slice-based knowledge platform. This portal is the
                index to all of it — free to clone, brand, and deploy.
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                — Indie builder, shipping in public
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
