import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  GithubLogo,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { TEMPLATES } from "@/data/templates";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // "custom" has its own static route (app/t/custom/page.tsx) — exclude it here.
  return TEMPLATES.filter((t) => t.slug !== "custom").map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = TEMPLATES.find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.blurb,
    openGraph: { title: t.title, description: t.blurb },
  };
}

export default async function TemplateDetail({ params }: Params) {
  const { slug } = await params;
  const t = TEMPLATES.find((x) => x.slug === slug);
  if (!t) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/#gallery"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft weight="bold" className="size-4" />
        All templates
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-14">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
            {t.vertical}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Live demo
                <ArrowUpRight weight="bold" className="size-4" />
              </a>
            ) : null}
            {t.repo ? (
              <a
                href={t.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-muted"
              >
                <GithubLogo weight="bold" className="size-4" />
                Get the repo
              </a>
            ) : null}
          </div>

          <h2 className="mt-12 text-sm font-mono uppercase tracking-wider text-muted-foreground">
            What it ships
          </h2>
          <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check
                  weight="bold"
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-muted shadow-2xl shadow-black/40 lg:sticky lg:top-24">
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
