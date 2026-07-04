// SSOT — fleet template registry (presentation + feature surface).
//
// This is the single source of truth for what the portal shows about each
// template: metadata, thumbnail, and the user-facing feature-slices it ships.
// `app/page.tsx` (and any future page) maps over TEMPLATES — do NOT hardcode
// template lists anywhere else.
//
// Scope note: root `../TEMPLATES.json` stays the FLEET-OPS manifest (repos,
// vercel projects, apply-core refs). THIS file is the PRESENTATION/features
// SSOT — different consumer, on purpose. `features` are grounded in each
// template's real `frontend/slices/*` + enabled landing sections, not generic
// marketing copy. Designed to migrate to the `resource` repo unchanged later.

export type TemplateEntry = {
  slug: string;
  title: string;
  vertical: string;
  blurb: string;
  demo: string;
  repo: string;
  thumb: string; // local: /thumbs/<slug>.webp (see portal/public/thumbs)
  features: string[]; // shipped feature-slices, short chips
};

export const TEMPLATES: TemplateEntry[] = [
  {
    slug: "personal-brand-os",
    title: "Personal Brand OS",
    vertical: "Personal brand / portfolio",
    blurb:
      "Personal brand & portfolio — blog, case-study portfolio, services with DOKU checkout, and gated resources.",
    demo: "https://personal-brand-os-ten.vercel.app",
    repo: "https://github.com/rahmanef63/template-personal-brand-os",
    thumb: "/thumbs/personal-brand-os.webp",
    features: [
      "Blog + posts",
      "Portfolio case-study",
      "Services + pricing",
      "DOKU guest checkout",
      "Gated resources",
      "Testimonials",
      "FAQ",
      "Contact form",
    ],
  },
  {
    slug: "agency-studio-os",
    title: "Agency Studio OS",
    vertical: "Creative agency studio",
    blurb:
      "Creative agency studio — portfolio case-studies, services, team, and a writing journal with AI chat.",
    demo: "https://agency-studio-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-agency-studio-os",
    thumb: "/thumbs/agency-studio-os.webp",
    features: [
      "Portfolio case-study",
      "Journal / essays",
      "Services + pricing",
      "Process timeline",
      "Team + bios",
      "AI chat",
      "Article comments",
      "Contact form",
    ],
  },
  {
    slug: "konsultan-os",
    title: "Konsultan OS",
    vertical: "Consultant / advisory",
    blurb:
      "Consultant / advisory — case studies, services, team expertise, insights, and AI chat intake.",
    demo: "https://konsultan-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-konsultan-os",
    thumb: "/thumbs/konsultan-os.webp",
    features: [
      "Case studies",
      "Services + pricing",
      "Team + expertise",
      "Insights / articles",
      "FAQ",
      "AI chat intake",
      "Comments",
      "Contact form",
    ],
  },
  {
    slug: "kreator-studio-os",
    title: "Kreator Studio OS",
    vertical: "Content creator studio",
    blurb:
      "Content creator studio — posts, showcase gallery, pricing with DOKU checkout, testimonials, and a journal.",
    demo: "https://kreator-studio-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-kreator-studio-os",
    thumb: "/thumbs/kreator-studio-os.webp",
    features: [
      "Posts + newsletter",
      "Showcase gallery",
      "Pricing + DOKU checkout",
      "Testimonials",
      "Journal / essays",
      "AI chat",
      "Comments",
      "About page",
    ],
  },
  {
    slug: "riset-kit",
    title: "Riset Kit",
    vertical: "Research / data toolkit",
    blurb:
      "Research workspace — document library, citation manager, publications, reading list, and an AI research reader.",
    demo: "https://riset-kit.vercel.app",
    repo: "https://github.com/rahmanef63/template-riset-kit",
    thumb: "/thumbs/riset-kit.webp",
    features: [
      "Document library",
      "Citation manager",
      "Publications",
      "Reading list",
      "Insights / methodology",
      "AI research chat",
      "Comments",
      "About page",
    ],
  },
  {
    slug: "saas-marketing-os",
    title: "SaaS Marketing OS",
    vertical: "SaaS marketing site",
    blurb:
      "SaaS marketing site — feature showcase, pricing, changelog, blog, and logo cloud to launch your product.",
    demo: "https://saas-marketing-os-omega.vercel.app",
    repo: "https://github.com/rahmanef63/template-saas-marketing-os",
    thumb: "/thumbs/saas-marketing-os.webp",
    features: [
      "Feature showcase",
      "Pricing + FAQ",
      "Changelog / releases",
      "Blog + posts",
      "Logo cloud",
      "AI chat",
      "Comments",
      "Contact form",
    ],
  },
  {
    slug: "wirausaha-os",
    title: "Wirausaha OS",
    vertical: "Entrepreneur / e-commerce",
    blurb:
      "Wirausaha / UKM commerce — katalog produk, multi-toko, layanan, dan checkout DOKU dalam satu situs.",
    demo: "https://wirausaha-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-wirausaha-os",
    thumb: "/thumbs/wirausaha-os.webp",
    features: [
      "Katalog + harga",
      "Toko & outlet",
      "Layanan & jasa",
      "Checkout + DOKU",
      "Fitur unggulan",
      "Testimoni",
      "AI chat",
      "Contact form",
    ],
  },
];
