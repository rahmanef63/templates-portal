import { cookies } from "next/headers";

// Tiny cookie-based i18n. No routing/middleware/dep — the whole portal is a
// handful of pages, so a dictionary + a `lang` cookie (toggled client-side,
// read in Server Components) is the lazy correct fit. Default: English.
export type Lang = "en" | "id";
export const LANGS: Lang[] = ["en", "id"];

export async function getLang(): Promise<Lang> {
  const c = await cookies();
  return c.get("lang")?.value === "id" ? "id" : "en";
}

type Dict = {
  nav: { index: string; brandKit: string; setup: string; update: string };
  masthead: { issue: string; stack: string };
  hero: {
    eyebrow: string;
    title1: string;
    accent: string;
    standfirst: (n: number) => string;
    cta1: string;
    cta2: string;
    fig: string;
    liveDemo: string;
  };
  index: {
    eyebrow: (n: number) => string;
    title: string;
    aside: string;
    readEntry: string;
  };
  toolkit: {
    eyebrow: string;
    brandKitTitle: string;
    brandKitBody: string;
    brandKitCta: string;
    setupTitle: string;
    setupBody: string;
    setupCta: string;
  };
  colophon: {
    eyebrow: string;
    builtBy: string;
    role: string;
    portfolio: string;
    source: string;
    knowledge: string;
    bio: string;
    byline: string;
  };
  footer: {
    tagline: string;
    navigate: string;
    maker: string;
    colophon: (year: number, name: string) => string;
  };
  detail: {
    all: string;
    liveDemo: string;
    getRepo: string;
    ships: string;
    fig: string;
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

const en: Dict = {
  nav: { index: "Index", brandKit: "Brand Kit", setup: "Setup", update: "Update" },
  masthead: { issue: "Free Templates — Issue Nº 01", stack: "Next.js 16 · Convex" },
  hero: {
    eyebrow: "The curated index",
    title1: "Production templates you clone, brand &",
    accent: "ship.",
    standfirst: (n) =>
      `Real Next.js 16 + Convex apps across ${n} verticals. Set your Brand Kit once, drop it into any template, and deploy a branded site in minutes.`,
    cta1: "Browse the index",
    cta2: "Build your Brand Kit",
    fig: "Fig. 01",
    liveDemo: "Live demo",
  },
  index: {
    eyebrow: (n) => `The Index — ${pad(n)} entries`,
    title: "Every template, one contents page",
    aside:
      "Production-ready · one vertical each · open an entry for features, live demo & repo",
    readEntry: "Read the entry",
  },
  toolkit: {
    eyebrow: "The Toolkit",
    brandKitTitle: "Brand Kit",
    brandKitBody:
      "Define your colors, fonts, logo, and voice once. Export a portable Brand Kit and drop it into any template — entirely client-side, no account.",
    brandKitCta: "Open Brand Kit",
    setupTitle: "Setup in one command",
    setupBody:
      "Clone, install, run. Every template follows the same setup flow — follow the guide to go from repo to live site fast.",
    setupCta: "Read the setup guide",
  },
  colophon: {
    eyebrow: "Colophon — About the maker",
    builtBy: "Built by",
    role: "Full-stack builder · Next.js + Convex",
    portfolio: "Portfolio",
    source: "Source",
    knowledge: "Knowledge",
    bio: "I ship a fleet of production Next.js 16 + Convex templates and rahman-resources, a slice-based knowledge platform. This portal is the index to all of it — free to clone, brand, and deploy.",
    byline: "— Indie builder, shipping in public",
  },
  footer: {
    tagline:
      "A free, open index of production Next.js + Convex templates. Clone, brand, ship.",
    navigate: "Navigate",
    maker: "Maker",
    colophon: (year, name) =>
      `Built with Geist Sans & Geist Mono · © ${year} ${name} · Free & open templates.`,
  },
  detail: {
    all: "All templates",
    liveDemo: "Live demo",
    getRepo: "Get the repo",
    ships: "What it ships",
    fig: "Fig.",
  },
};

const id: Dict = {
  nav: { index: "Indeks", brandKit: "Brand Kit", setup: "Setup", update: "Update" },
  masthead: { issue: "Free Templates — Edisi Nº 01", stack: "Next.js 16 · Convex" },
  hero: {
    eyebrow: "Indeks terkurasi",
    title1: "Template produksi untuk kamu klon, brand &",
    accent: "rilis.",
    standfirst: (n) =>
      `Aplikasi Next.js 16 + Convex asli untuk ${n} vertikal. Susun Brand Kit sekali, pasang ke template mana pun, dan rilis situs ber-brand dalam hitungan menit.`,
    cta1: "Jelajahi indeks",
    cta2: "Susun Brand Kit",
    fig: "Gbr. 01",
    liveDemo: "Demo langsung",
  },
  index: {
    eyebrow: (n) => `Indeks — ${pad(n)} entri`,
    title: "Semua template, satu halaman daftar isi",
    aside:
      "Siap produksi · satu vertikal tiap entri · buka entri untuk fitur, demo langsung & repo",
    readEntry: "Baca entri",
  },
  toolkit: {
    eyebrow: "Perkakas",
    brandKitTitle: "Brand Kit",
    brandKitBody:
      "Tetapkan warna, font, logo, dan suara brand-mu sekali. Ekspor Brand Kit portabel dan pasang ke template mana pun — sepenuhnya sisi klien, tanpa akun.",
    brandKitCta: "Buka Brand Kit",
    setupTitle: "Setup satu perintah",
    setupBody:
      "Klon, pasang, jalankan. Semua template mengikuti alur setup yang sama — ikuti panduannya untuk berpindah dari repo ke situs live dengan cepat.",
    setupCta: "Baca panduan setup",
  },
  colophon: {
    eyebrow: "Kolofon — Tentang pembuat",
    builtBy: "Dibuat oleh",
    role: "Full-stack builder · Next.js + Convex",
    portfolio: "Portofolio",
    source: "Kode sumber",
    knowledge: "Pengetahuan",
    bio: "Saya merilis armada template produksi Next.js 16 + Convex dan rahman-resources, platform pengetahuan berbasis slice. Portal ini adalah indeks dari semuanya — gratis untuk diklon, di-brand, dan dirilis.",
    byline: "— Builder indie, berkarya terbuka",
  },
  footer: {
    tagline:
      "Indeks gratis dan terbuka berisi template produksi Next.js + Convex. Klon, brand, rilis.",
    navigate: "Navigasi",
    maker: "Pembuat",
    colophon: (year, name) =>
      `Dibuat dengan Geist Sans & Geist Mono · © ${year} ${name} · Template gratis & terbuka.`,
  },
  detail: {
    all: "Semua template",
    liveDemo: "Demo langsung",
    getRepo: "Ambil repo",
    ships: "Yang disertakan",
    fig: "Gbr.",
  },
};

export const dictionaries: Record<Lang, Dict> = { en, id };
export const getDict = (lang: Lang): Dict => dictionaries[lang];
