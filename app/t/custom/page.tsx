import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Stats from "@/components/blocks/Stats";
import FeatureGrid from "@/components/blocks/FeatureGrid";
import Pricing from "@/components/blocks/Pricing";
import Testimonials from "@/components/blocks/Testimonials";
import Faq from "@/components/blocks/Faq";
import Cta from "@/components/blocks/Cta";

// /t/custom — the centralized block library, rendered live. This static route
// shadows the generic /t/[slug] detail page on purpose: opening "custom" shows
// EVERY shared block in sequence (the all-features showcase), not a thumbnail.
// Every section below is a portal/components/blocks/* component, props-driven.

export const metadata: Metadata = {
  title: "Custom OS",
  description:
    "Every shared block in one page. The portal's component library rendered live, ready to compose into your own template.",
  openGraph: {
    title: "Custom OS",
    description: "The portal's component library, rendered live.",
  },
};

export default function CustomShowcase() {
  return (
    <div>
      {/* Header — doubles as the showcase hero, no separate Hero block */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16">
          <Link
            href="/#gallery"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft weight="bold" className="size-4" />
            All templates
          </Link>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-wider text-primary">
            All blocks / build-your-own
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Custom OS, every shared block on one page.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            This is the portal&rsquo;s component library, rendered live in the
            refined-dark design every template ships with. Compose your own
            template from these blocks, drop in your Brand Kit, and deploy.
          </p>
        </div>
      </section>

      <Stats
        stats={[
          { value: "7", label: "Verticals" },
          { value: "<5 min", label: "Clone to deploy" },
          { value: "100%", label: "Type-safe" },
          { value: "$0", label: "Account needed" },
        ]}
      />

      <FeatureGrid
        title="Everything wired before you clone it"
        features={[
          {
            icon: "auth",
            title: "Convex auth, already plumbed",
            body: "Email and OAuth sign-in, session handling, and per-user row ownership ship pre-configured. Swap your provider keys and you have a real account system, not a login page mockup.",
          },
          {
            icon: "data",
            title: "Reactive data layer",
            body: "Convex queries push live updates to every open tab, no polling or websocket glue.",
          },
          {
            icon: "security",
            title: "Authz at the mutation",
            body: "Every write checks the caller, so a fresh deploy is never silently read-only.",
          },
          {
            icon: "design",
            title: "Drop-in Brand Kit",
            body: "Colors, fonts, and logo load from a portable kit, no rebuild to rebrand.",
          },
          {
            icon: "performance",
            title: "Next.js 16 defaults",
            body: "Cache Components and streaming on by default, tuned for Vercel and self-host alike.",
          },
        ]}
      />

      <Pricing
        tiers={[
          {
            name: "Solo",
            price: "$0",
            period: "/forever",
            href: "/#gallery",
            features: [
              "Clone any 1 template",
              "Brand Kit export, client-side",
              "Self-host on your own Convex",
              "Community support",
            ],
          },
          {
            name: "Studio",
            price: "$24",
            period: "/month",
            featured: true,
            href: "/#gallery",
            features: [
              "All production templates",
              "Unlimited Brand Kits",
              "One-command deploy guide",
              "Priority issue triage",
              "Convex schema migrations",
            ],
          },
          {
            name: "Agency",
            price: "$89",
            period: "/month",
            href: "/#gallery",
            features: [
              "Everything in Studio",
              "White-label the portal",
              "5 client workspaces",
              "Onboarding call",
            ],
          },
        ]}
      />

      <Testimonials
        label="Shipped with it"
        heading="Teams clone, brand, and deploy in an afternoon."
        items={[
          {
            quote:
              "We forked the booking template on Monday and had a branded client portal live by Thursday. The Convex schema was the part I expected to fight, and it just worked.",
            author: "Priya Nair",
            role: "Founder, Calmwater Studio",
          },
          {
            quote:
              "The Brand Kit export is the trick. One color and logo pass, dropped into three different templates, and every site felt like ours instead of a starter.",
            author: "Marcus Lehmann",
            role: "Design lead, Northbound Agency",
          },
          {
            quote:
              "I am not a backend person. The setup guide got me from clone to deployed without a single Convex error, which has genuinely never happened to me before.",
            author: "Dao Tran",
            role: "Solo developer",
          },
          {
            quote:
              "We evaluated four boilerplates. This was the only one where the demo code matched production patterns instead of toy examples we had to rewrite.",
            author: "Elena Castro",
            role: "CTO, Ledgerwise",
          },
        ]}
      />

      <Faq
        items={[
          {
            q: "Do I need a Convex account to run a template locally?",
            a: "No. Every template runs against your own Convex deployment. Run npx convex dev once and it provisions a dev backend tied to your repo, no portal account required.",
          },
          {
            q: "How does the Brand Kit get into a template?",
            a: "Build your Brand Kit here, export the portable JSON, and import it inside any template's settings. Colors, fonts, logo, and voice apply instantly, entirely client-side.",
          },
          {
            q: "Can I deploy to Vercel instead of self-hosting?",
            a: "Yes. Each template ships a build:auto step that couples a Convex deploy with next build. Set NEXT_PUBLIC_CONVEX_URL and CONVEX_DEPLOY_KEY in Vercel and push.",
          },
          {
            q: "Will updating a template overwrite my data?",
            a: "No. convex deploy migrates schema without touching documents. Pull the latest template code, redeploy, and your existing records stay intact.",
          },
        ]}
      />

      <Cta
        title="Compose your own, ship it this weekend."
        subtitle="Start from any template, mix in the blocks you need, drop in your Brand Kit, and deploy. No account, no lock-in."
        ctaLabel="Browse templates"
        ctaHref="/#gallery"
        secondaryLabel="Build your Brand Kit"
        secondaryHref="/brand-kit"
      />
    </div>
  );
}
