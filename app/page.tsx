import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { SITE_URL, SITE_NAME } from "./site";
import { getLang, getDict } from "./dictionaries";
import { getTemplates, getSettings } from "@/lib/content";

export default async function HomePage() {
  const t = getDict(await getLang());
  const templates = await getTemplates();
  const s = await getSettings();
  const lead = templates[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE_NAME,
    description: s.siteDesc,
    url: SITE_URL,
    numberOfItems: templates.length,
    itemListElement: templates.map((tpl, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tpl.title,
      description: tpl.blurb,
      url: tpl.demo || `${SITE_URL}/t/${tpl.slug}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 pt-16 pb-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:pt-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-[13px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              {t.hero.eyebrow} · {templates.length}
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              {t.hero.title1} <span className="text-accent">{t.hero.accent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t.hero.standfirst(templates.length)}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#index"
                className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {t.hero.cta1}
                <ArrowRight weight="bold" className="size-4" />
              </a>
              <Link
                href="/brand-kit"
                className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border-strong bg-background px-5 text-sm font-medium transition hover:bg-muted"
              >
                {t.hero.cta2}
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-[var(--shadow-card)]">
              <Image
                src={lead.thumb}
                alt={`${lead.title} preview`}
                width={1600}
                height={840}
                priority
                className="w-full"
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between px-1 text-[13px] text-faint">
              <span>{lead.vertical}</span>
              <a href={lead.demo} className="text-accent hover:underline">
                {t.hero.liveDemo} ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="index" className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            {t.index.title}
          </h2>
          <p className="max-w-2xl text-muted-foreground">{t.index.aside}</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Link
              key={tpl.slug}
              href={`/t/${tpl.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-card)] transition hover:border-border-strong"
            >
              <div className="relative aspect-[40/21] w-full overflow-hidden border-b border-border bg-muted">
                <Image
                  src={tpl.thumb}
                  alt={`${tpl.title} preview`}
                  fill
                  sizes="(min-width:1024px) 380px, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{tpl.title}</h3>
                <p className="mt-0.5 text-[13px] text-faint">{tpl.vertical}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {tpl.features.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="rounded-md border border-border bg-muted px-2 py-0.5 text-[12px] text-muted-foreground"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-accent">
                  {t.index.readEntry}
                  <ArrowRight
                    weight="bold"
                    className="size-3.5 transition group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TOOLKIT */}
      <section className="border-t border-border bg-background-subtle">
        <div className="mx-auto grid max-w-[1200px] gap-5 px-5 py-16 sm:grid-cols-2 lg:px-8 lg:py-20">
          <div className="flex flex-col rounded-xl border border-border bg-background p-8 shadow-[var(--shadow-card)]">
            <h3 className="text-xl font-semibold tracking-[-0.01em]">{t.toolkit.brandKitTitle}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
              {t.toolkit.brandKitBody}
            </p>
            <Link
              href="/brand-kit"
              className="mt-6 inline-flex h-10 w-fit items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t.toolkit.brandKitCta}
              <ArrowRight weight="bold" className="size-4" />
            </Link>
          </div>
          <div className="flex flex-col rounded-xl border border-border bg-background p-8 shadow-[var(--shadow-card)]">
            <h3 className="text-xl font-semibold tracking-[-0.01em]">{t.toolkit.setupTitle}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">
              {t.toolkit.setupBody}
            </p>
            <Link
              href="/docs/setup"
              className="mt-6 inline-flex h-10 w-fit items-center gap-1.5 rounded-md border border-border-strong bg-background px-4 text-sm font-medium transition hover:bg-muted"
            >
              {t.toolkit.setupCta}
            </Link>
          </div>
        </div>
      </section>

      {/* MAKER */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {s.makerName.charAt(0)}
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-[-0.01em]">{s.makerName}</h2>
                  <p className="text-[13px] text-faint">{s.makerRole}</p>
                </div>
              </div>
              <dl className="mt-6 space-y-2.5 text-sm">
                {[
                  [t.colophon.portfolio, s.makerSite, "rahmanef.com"],
                  [t.colophon.source, s.makerGithub, `github.com/${s.makerHandle}`],
                  [t.colophon.knowledge, s.makerResources, "resource.rahmanef.com"],
                ].map(([label, href, text]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <dt className="text-faint">{label}</dt>
                    <dd>
                      <a href={href} className="text-accent hover:underline">
                        {text} ↗
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-16">
              <p className="text-2xl font-medium leading-[1.5] tracking-[-0.01em]">
                {t.colophon.bio}
              </p>
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Check weight="bold" className="size-4 text-accent" />
                {t.colophon.byline}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
