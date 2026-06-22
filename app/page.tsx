import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { TEMPLATES } from "@/data/templates";
import { SITE_URL, SITE_NAME, SITE_DESC } from "./site";

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
    url: t.demo,
  })),
};

export default function HomePage() {
  const [a, b] = TEMPLATES;
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — asymmetric split, left-aligned, real thumbnail visual, no glow */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Next.js 16 · Convex · {TEMPLATES.length} verticals
            </p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Production templates you clone, brand, and ship.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Real Next.js + Convex apps across {TEMPLATES.length} verticals. Build your
              Brand Kit once, drop it into any template, deploy a branded site in minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#gallery"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Browse templates
                <ArrowRight weight="bold" className="size-4" />
              </a>
              <Link
                href="/brand-kit"
                className="inline-flex items-center rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
              >
                Build your Brand Kit
              </Link>
            </div>
          </div>

          {/* Real visual: two template previews, offset stack */}
          <div className="relative hidden h-[320px] lg:block">
            <div className="absolute right-8 top-2 w-[80%] overflow-hidden rounded-xl border border-border bg-muted shadow-2xl shadow-black/40">
              <Image
                src={b.thumb}
                alt={`${b.title} preview`}
                width={1600}
                height={840}
                className="w-full"
              />
            </div>
            <div className="absolute bottom-2 left-0 w-[80%] overflow-hidden rounded-xl border border-primary/30 bg-muted shadow-2xl shadow-black/50">
              <Image
                src={a.thumb}
                alt={`${a.title} preview`}
                width={1600}
                height={840}
                priority
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery — readable card grid, each links to its detail page */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Template gallery
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            {TEMPLATES.length} production-ready templates, each for a different vertical.
            Open one to see its features, live demo, and repo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link
              key={t.slug}
              href={`/t/${t.slug}`}
              className="reveal group flex flex-col overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:border-primary/50"
            >
              <div className="relative aspect-[40/21] w-full overflow-hidden border-b border-border bg-muted">
                <Image
                  src={t.thumb}
                  alt={`${t.title} preview`}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.vertical}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {t.features.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                  View details
                  <ArrowRight
                    weight="bold"
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Teasers */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-20">
          <div className="flex flex-col rounded-xl border border-border bg-muted/30 p-8 transition-colors hover:border-primary/50">
            <h3 className="text-xl font-semibold tracking-tight">Brand Kit</h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Define your colors, fonts, logo, and voice once. Export a portable
              Brand Kit and drop it into any template, entirely client-side, no
              account required.
            </p>
            <Link
              href="/brand-kit"
              className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Open Brand Kit
              <ArrowRight weight="bold" className="size-4" />
            </Link>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-muted/30 p-8 transition-colors hover:border-primary/50">
            <h3 className="text-xl font-semibold tracking-tight">Setup in one command</h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Clone, install, and run. Every template follows the same setup flow.
              Follow the guide to go from repo to live site fast.
            </p>
            <Link
              href="/docs/setup"
              className="mt-6 inline-flex w-fit items-center rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
            >
              Read the setup guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
