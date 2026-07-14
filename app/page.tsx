import Link from "next/link";
import { ArrowRight, ArrowUpRight, GithubLogo, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { SITE_URL, SITE_NAME, TUTORIAL_URL, JULES_URL } from "./site";
import { getLang, getDict } from "./dictionaries";
import { getTemplates, getSettings } from "@/lib/content";
import { TemplateIndex } from "@/components/template-index";

export default async function HomePage() {
  const t = getDict(await getLang());
  const templates = await getTemplates();
  const s = await getSettings();

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

      {/* THE INDEX — leads the page (no hero) */}
      <TemplateIndex
        templates={templates}
        labels={{
          eyebrow: t.index.eyebrow(templates.length),
          title: t.index.title,
          aside: t.index.aside,
          readEntry: t.index.readEntry,
          viewList: t.index.viewList,
          viewGallery: t.index.viewGallery,
        }}
      />

      {/* TOOLKIT */}
      <section className="border-t-2 border-[var(--rule)] bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
            {t.toolkit.eyebrow}
          </p>
          <div className="mt-8 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
            <div className="flex flex-col bg-background p-8 lg:p-10">
              <h3 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">
                {t.toolkit.brandKitTitle}
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                {t.toolkit.brandKitBody}
              </p>
              <Link
                href="/brand-kit"
                className="mt-8 inline-flex w-fit items-center gap-2 bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                {t.toolkit.brandKitCta}
                <ArrowRight weight="bold" className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col bg-background p-8 lg:p-10">
              <h3 className="font-display text-2xl tracking-[-0.01em] sm:text-3xl">
                {t.toolkit.setupTitle}
              </h3>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">
                {t.toolkit.setupBody}
              </p>
              <Link
                href="/docs/setup"
                className="group mt-8 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground"
              >
                <span className="border-b border-primary pb-1">{t.toolkit.setupCta}</span>
                <ArrowUpRight
                  weight="bold"
                  className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VIBE-CODE IT — connect the repo to an AI coder */}
      <section className="border-t-2 border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                {t.vibe.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-[1.05] tracking-[-0.02em] sm:text-4xl">
                {t.vibe.title}
              </h2>
              <div className="mt-8 flex flex-wrap gap-2.5">
                <a
                  href={JULES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:border-primary hover:text-primary"
                >
                  <Sparkle weight="fill" className="size-3.5 text-primary" />
                  {t.vibe.julesLabel} ↗
                </a>
                <span className="inline-flex items-center gap-2 border border-border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <GithubLogo weight="bold" className="size-3.5" />
                  {t.vibe.coderLabel}
                </span>
              </div>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-20">
              <p className="text-lg leading-relaxed text-muted-foreground">{t.vibe.body}</p>
              <p className="mt-6 border-l-2 border-primary bg-muted/40 py-3 pl-4 pr-3 text-sm leading-relaxed">
                {t.vibe.tip}
              </p>
              <a
                href={TUTORIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary"
              >
                <span className="border-b border-primary pb-1">{t.vibe.tutorial}</span>
                <ArrowUpRight weight="bold" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* COLOPHON — the maker */}
      <section className="border-t-2 border-[var(--rule)]">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
            {t.colophon.eyebrow}
          </p>
          <div className="mt-10 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <h2 className="font-display text-4xl leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                {t.colophon.builtBy} <span className="italic text-primary">{s.makerName}</span>
              </h2>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t.colophon.role}
              </p>
              <dl className="mt-10 space-y-4 border-t border-border pt-6 font-mono text-xs uppercase tracking-[0.14em]">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.colophon.portfolio}</dt>
                  <dd>
                    <a href={s.makerSite} className="border-b border-primary pb-0.5 hover:text-primary">
                      rahmanef.com ↗
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.colophon.source}</dt>
                  <dd>
                    <a href={s.makerGithub} className="border-b border-primary pb-0.5 hover:text-primary">
                      github.com/{s.makerHandle} ↗
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{t.colophon.knowledge}</dt>
                  <dd>
                    <a href={s.makerResources} className="border-b border-primary pb-0.5 hover:text-primary">
                      resource.rahmanef.com ↗
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="lg:border-l lg:border-border lg:pl-20">
              <p className="font-display text-2xl leading-[1.5] text-foreground first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-7xl first-letter:font-medium first-letter:leading-[0.7] first-letter:text-primary sm:text-[1.7rem]">
                {t.colophon.bio}
              </p>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {t.colophon.byline}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
