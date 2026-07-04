import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_DESC, MAKER } from "./site";
import { getLang, getDict } from "./dictionaries";
import { getSettings } from "@/lib/content";
import LangToggle from "@/components/LangToggle";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

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
  { href: "/", key: "index" },
  { href: "/brand-kit", key: "brandKit" },
  { href: "/docs/setup", key: "setup" },
  { href: "/docs/update", key: "update" },
] as const;

// No-FOUC: apply the stored theme (default dark) before first paint.
const themeScript = `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('theme')||'dark')}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();
  const t = getDict(lang);
  const s = await getSettings();
  const year = new Date().getFullYear();
  return (
    <html
      lang={lang}
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          {lang === "id" ? "Lewati ke konten" : "Skip to content"}
        </a>

        <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-5 lg:px-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]"
            >
              <span className="grid size-6 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                ▲
              </span>
              {s.siteName}
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <ul className="mr-1 hidden items-center gap-1 text-sm sm:flex">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-md px-2.5 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {t.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
              <ThemeToggle />
              <LangToggle current={lang} />
            </div>
          </nav>
        </header>

        <main id="main" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-12 sm:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
            <div>
              <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
                <span className="grid size-6 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                  ▲
                </span>
                {s.siteName}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t.footer.tagline}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{t.footer.navigate}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-foreground">
                      {t.nav[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[13px] font-medium text-foreground">{t.footer.maker}</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href={s.makerSite} className="transition hover:text-foreground">
                    rahmanef.com ↗
                  </a>
                </li>
                <li>
                  <a href={s.makerGithub} className="transition hover:text-foreground">
                    github.com/{s.makerHandle} ↗
                  </a>
                </li>
                <li>
                  <a href={s.makerResources} className="transition hover:text-foreground">
                    resource.rahmanef.com ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border">
            <p className="mx-auto max-w-[1200px] px-5 py-5 text-[13px] text-faint lg:px-8">
              {t.footer.colophon(year, s.makerName)}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
