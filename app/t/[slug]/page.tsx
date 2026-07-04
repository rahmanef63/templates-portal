import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, GithubLogo, Check } from "@phosphor-icons/react/dist/ssr";
import { getTemplates } from "@/lib/content";
import { getLang, getDict } from "../../dictionaries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = (await getTemplates()).find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.blurb,
    openGraph: { title: t.title, description: t.blurb },
  };
}

export default async function TemplateDetail({ params }: Params) {
  const { slug } = await params;
  const t = (await getTemplates()).find((x) => x.slug === slug);
  if (!t) notFound();
  const d = getDict(await getLang()).detail;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-12 lg:px-8 lg:py-16">
      <Link
        href="/#index"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft weight="bold" className="size-4" />
        {d.all}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
        <div>
          <p className="text-[13px] text-faint">{t.vertical}</p>
          <h1 className="mt-2 text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {t.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t.blurb}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {t.demo ? (
              <a
                href={t.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                {d.liveDemo}
                <ArrowUpRight weight="bold" className="size-4" />
              </a>
            ) : null}
            {t.repo ? (
              <a
                href={t.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border-strong bg-background px-5 text-sm font-medium transition hover:bg-muted"
              >
                <GithubLogo weight="bold" className="size-4" />
                {d.getRepo}
              </a>
            ) : null}
          </div>

          <h2 className="mt-12 text-[13px] font-medium text-muted-foreground">{d.ships}</h2>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-[var(--shadow-card)] lg:sticky lg:top-24">
          <Image
            src={t.thumb}
            alt={`${t.title} preview`}
            width={1600}
            height={840}
            priority
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
