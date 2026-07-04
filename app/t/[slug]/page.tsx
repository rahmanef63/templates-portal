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
  return TEMPLATES.map((t) => ({ slug: t.slug }));
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
          <h1 className="mt-3 font-display text-4xl font-medium tracking-[-0.02em] sm:text-6xl">
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
                className="inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:-translate-y-0.5"
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
                className="group inline-flex items-center gap-2 border-b border-primary pb-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground"
              >
                <GithubLogo weight="bold" className="size-4 text-primary" />
                Get the repo
              </a>
            ) : null}
          </div>

          <h2 className="mt-14 border-t border-border pt-6 text-xs font-mono uppercase tracking-[0.22em] text-primary">
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

        <figure className="lg:sticky lg:top-28">
          <div className="overflow-hidden border border-[var(--rule)] bg-muted">
            <Image
              src={t.thumb}
              alt={`${t.title} preview`}
              width={1600}
              height={840}
              priority
              className="w-full contrast-[1.02]"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            Fig. — {t.vertical}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
