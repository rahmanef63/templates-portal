import Link from "next/link";

type Template = {
  name: string;
  vertical: string;
  demo: string;
  repo: string;
};

const TEMPLATES: Template[] = [
  {
    name: "Personal Brand OS",
    vertical: "Personal brand / portfolio",
    demo: "https://personal-brand-os-ten.vercel.app",
    repo: "https://github.com/rahmanef63/template-personal-brand-os",
  },
  {
    name: "Agency Studio OS",
    vertical: "Creative agency studio",
    demo: "https://agency-studio-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-agency-studio-os",
  },
  {
    name: "Konsultan OS",
    vertical: "Consultant / advisory",
    demo: "https://konsultan-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-konsultan-os",
  },
  {
    name: "Kreator Studio OS",
    vertical: "Content creator studio",
    demo: "https://kreator-studio-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-kreator-studio-os",
  },
  {
    name: "Riset Kit",
    vertical: "Research / data toolkit",
    demo: "https://riset-kit.vercel.app",
    repo: "https://github.com/rahmanef63/template-riset-kit",
  },
  {
    name: "SaaS Marketing OS",
    vertical: "SaaS marketing site",
    demo: "https://saas-marketing-os-omega.vercel.app",
    repo: "https://github.com/rahmanef63/template-saas-marketing-os",
  },
  {
    name: "Wirausaha OS",
    vertical: "Entrepreneur / e-commerce",
    demo: "https://wirausaha-os.vercel.app",
    repo: "https://github.com/rahmanef63/template-wirausaha-os",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Discover · Demo · Set up · Update
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            One place to discover, demo, set up, and update your templates.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Build your Brand Kit once and reuse it across every template. Browse
            live demos, grab the repo, and ship a branded site in minutes — no
            backend, no lock-in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#gallery"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse templates
            </a>
            <Link
              href="/brand-kit"
              className="rounded-lg border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Build your Brand Kit
            </Link>
          </div>
        </div>
      </section>

      {/* Template gallery */}
      <section id="gallery" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Template gallery
          </h2>
          <p className="text-muted-foreground">
            Seven production-ready templates, each for a different vertical. Try
            the live demo, then clone the repo to make it yours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <article
              key={t.name}
              className="group flex flex-col rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <h3 className="text-lg font-semibold tracking-tight">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.vertical}</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                <a
                  href={t.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Live demo →
                </a>
                <a
                  href={t.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Get template →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Teasers */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 sm:py-20">
          <div className="flex flex-col rounded-xl border border-border bg-background p-8">
            <h3 className="text-xl font-semibold tracking-tight">Brand Kit</h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Define your colors, fonts, logo, and voice once. Export a portable
              Brand Kit and drop it into any template — entirely client-side, no
              account required.
            </p>
            <Link
              href="/brand-kit"
              className="mt-6 inline-flex w-fit rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open Brand Kit →
            </Link>
          </div>

          <div className="flex flex-col rounded-xl border border-border bg-background p-8">
            <h3 className="text-xl font-semibold tracking-tight">
              Setup in one command
            </h3>
            <p className="mt-3 flex-1 text-muted-foreground">
              Clone, install, and run — every template follows the same setup
              flow. Follow the guide to go from repo to live site fast.
            </p>
            <Link
              href="/docs/setup"
              className="mt-6 inline-flex w-fit rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Read the setup guide →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
