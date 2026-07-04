import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESC, MAKER } from "./site";

// Display — editorial variable serif. opsz/SOFT/WONK carry the character; italic
// is used for pull-words. No `weight` prop: a variable font drives weight via axis.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

// Body — clean neo-grotesque for UI + prose.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Metadata / labels / numerals — credible dev-tool mono.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  authors: [{ name: MAKER.name, url: MAKER.site }],
  creator: MAKER.name,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESC },
  robots: { index: true, follow: true },
};

const NAV = [
  { href: "/", label: "Index" },
  { href: "/brand-kit", label: "Brand Kit" },
  { href: "/docs/setup", label: "Setup" },
  { href: "/docs/update", label: "Update" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const year = new Date().getFullYear();
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${hanken.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>

        {/* Masthead — two stacked rows, solid paper (no blur), crisp rule below. */}
        <header className="sticky top-0 z-40 border-b-2 border-[var(--rule)] bg-background">
          <div className="mx-auto max-w-6xl px-6 lg:px-10">
            <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span>Free Templates — Issue Nº 01</span>
              <span className="hidden sm:inline">Next.js 16 · Convex</span>
              <span className="hidden md:inline">free-template.rahmanef.com</span>
            </div>
            <nav className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className="flex items-baseline gap-1.5 font-display text-xl tracking-tight"
              >
                <span className="align-super text-xs text-primary">Nº</span>
                <span>Free Templates</span>
              </Link>
              <ul className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:gap-6">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="pb-1 transition-colors hover:border-b-2 hover:border-primary hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Colophon footer — ink, rules, one vermilion for hover underlines. */}
        <footer className="border-t-2 border-[var(--rule)] bg-muted/40">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:px-10">
            <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-8">
              <div>
                <p className="font-display text-3xl italic leading-none tracking-tight">
                  Free Templates
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  A free, open index of production Next.js + Convex templates.
                  Clone, brand, ship.
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                  Navigate
                </p>
                <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                  Maker
                </p>
                <ul className="mt-4 space-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <li>
                    <a href={MAKER.site} className="transition-colors hover:text-foreground">
                      rahmanef.com ↗
                    </a>
                  </li>
                  <li>
                    <a href={MAKER.github} className="transition-colors hover:text-foreground">
                      github.com/{MAKER.handle} ↗
                    </a>
                  </li>
                  <li>
                    <a href={MAKER.resources} className="transition-colors hover:text-foreground">
                      resource.rahmanef.com ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="mt-12 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Set in Fraunces, Hanken Grotesk &amp; IBM Plex Mono · © {year}{" "}
              {MAKER.name} · Stateless, client-side only.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
