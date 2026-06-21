import Link from "next/link";
import Image from "next/image";
import { TEMPLATES } from "@/data/templates";

// Mosaic tile spans (per template index) — packs the 7 tiles into a seamless,
// gap-less wall: one 2×2 feature + wide bands fill a clean rectangle.
// sm = 2-col, lg = 4-col, mobile = 1-col stack.
const MOSAIC_SPANS = [
  "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  "",
  "",
  "sm:col-span-2 lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
  "",
  "",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Discover · Demo · Set up · Update
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            One place to discover, demo, set up, and update your templates.
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

        <div className="grid auto-rows-[58vw] grid-cols-1 gap-0 sm:auto-rows-[30vw] sm:grid-cols-2 lg:auto-rows-[16vw] lg:grid-cols-4">
          {TEMPLATES.map((t, i) => (
            <article
              key={t.slug}
              className={`group relative overflow-hidden bg-muted ${MOSAIC_SPANS[i] ?? ""}`}
            >
              <Image
                src={t.thumb}
                alt={`${t.title} preview`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />

              {/* Mobile (no hover): title + links always visible */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 lg:hidden">
                <h3 className="text-sm font-semibold leading-tight tracking-tight text-white">
                  {t.title}
                </h3>
                <p className="text-[11px] text-white/70">{t.vertical}</p>
                <div className="mt-1.5 flex gap-3 text-[11px] font-medium">
                  <a
                    href={t.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline-offset-2 hover:underline"
                  >
                    Demo →
                  </a>
                  <a
                    href={t.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 underline-offset-2 hover:underline"
                  >
                    Repo →
                  </a>
                </div>
              </div>

              {/* Desktop: gradient drawer fades in on hover */}
              <div className="absolute inset-0 hidden flex-col justify-end bg-gradient-to-t from-black/90 via-black/65 to-black/10 p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:flex">
                <h3 className="text-lg font-semibold tracking-tight text-white">{t.title}</h3>
                <p className="mt-0.5 text-xs text-white/70">{t.vertical}</p>
                <p className="mt-2 line-clamp-3 text-sm text-white/85">{t.blurb}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {t.features.slice(0, 5).map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur-sm"
                    >
                      {f}
                    </li>
                  ))}
                  {t.features.length > 5 && (
                    <li className="px-1 py-0.5 text-[11px] text-white/60">
                      +{t.features.length - 5}
                    </li>
                  )}
                </ul>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                  <a
                    href={t.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline-offset-4 hover:underline"
                  >
                    Live demo →
                  </a>
                  <a
                    href={t.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 underline-offset-4 hover:text-white hover:underline"
                  >
                    Get template →
                  </a>
                </div>
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
