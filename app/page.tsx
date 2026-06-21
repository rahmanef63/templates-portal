import Link from "next/link";
import Image from "next/image";
import { TEMPLATES } from "@/data/templates";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <p className="mb-5 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Discover · Demo · Set up · Update
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            One place to discover, demo, set up, and update your{" "}
            <span className="bg-gradient-to-r from-primary to-fuchsia-400 bg-clip-text text-transparent">
              templates
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Build your Brand Kit once and reuse it across every template. Browse
            live demos, grab the repo, and ship a branded site in minutes — no
            backend, no lock-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#gallery"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse templates
            </a>
            <Link
              href="/brand-kit"
              className="rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Build your Brand Kit
            </Link>
          </div>
        </div>
      </section>

      {/* Template gallery */}
      <section id="gallery" className="py-16 sm:py-20">
        <div className="mx-auto mb-10 flex max-w-6xl flex-col gap-2 px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Template gallery
          </h2>
          <p className="text-muted-foreground">
            Seven production-ready templates, each for a different vertical. Try
            the live demo, then clone the repo to make it yours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
          {TEMPLATES.map((t, i) => (
            <article
              key={t.slug}
              className={`group relative aspect-[40/21] overflow-hidden bg-muted ${i === 0 ? "sm:col-span-2" : ""}`}
            >
              <Image
                src={t.thumb}
                alt={`${t.title} preview`}
                fill
                priority={i === 0}
                sizes={i === 0 ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
              />

              {/* Meta-image already shows title + features. Mobile (no hover):
                  a slim always-visible action bar with the clickable links. */}
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/80 to-transparent p-3 text-[11px] font-medium lg:hidden">
                <a
                  href={t.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/95 px-2.5 py-1 font-semibold text-black"
                >
                  Demo
                </a>
                <a
                  href={t.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 underline-offset-2 hover:underline"
                >
                  Repo →
                </a>
              </div>

              {/* Desktop: light scrim + action buttons fade in on hover (image stays visible) */}
              <div className="absolute inset-0 hidden items-end gap-2 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 lg:flex">
                <a
                  href={t.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
                >
                  View demo →
                </a>
                <a
                  href={t.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                >
                  Repo
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Teasers */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-20">
          <div className="flex flex-col rounded-xl border border-border bg-background p-8">
            <h3 className="text-xl font-semibold tracking-tight">Brand Kit</h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Define your colors, fonts, logo, and voice once. Export a portable
              Brand Kit and drop it into any template — entirely client-side, no
              account required.
            </p>
            <Link
              href="/brand-kit"
              className="mt-6 inline-flex w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open Brand Kit →
            </Link>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-background p-8">
            <h3 className="text-xl font-semibold tracking-tight">
              Setup in one command
            </h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Clone, install, and run — every template follows the same setup
              flow. Follow the guide to go from repo to live site fast.
            </p>
            <Link
              href="/docs/setup"
              className="mt-6 inline-flex w-fit rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Read the setup guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
