import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Update guide",
  description:
    "Move your template to a new version without losing data. The backend redeploy preserves every table; the frontend updates in place via an upstream git remote.",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 text-sm leading-relaxed">
      <code className="font-mono text-foreground">{children}</code>
    </pre>
  );
}

export default function UpdatePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Heading */}
      <header className="border-b border-border pb-8">
        <p className="mb-4 inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Docs · Update
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Update to a new version without losing your data
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A template has two halves: the{" "}
          <span className="font-medium text-foreground">backend</span> (your
          Convex data and schema) and the{" "}
          <span className="font-medium text-foreground">frontend</span> (the
          app code you cloned). They update independently — and neither one
          requires you to throw away what you already have.
        </p>
      </header>

      {/* TL;DR */}
      <section className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          The short version
        </h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="mt-0.5 select-none text-primary">→</span>
            <span>
              <span className="font-medium">Backend:</span> just run{" "}
              <Code>convex deploy</Code> again. Your table data is preserved.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 select-none text-primary">→</span>
            <span>
              <span className="font-medium">Frontend:</span> add the template
              repo as an <Code>upstream</Code> remote and{" "}
              <Code>git pull</Code> the new version into your customizations.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 select-none text-primary">→</span>
            <span>
              <span className="font-medium">Never</span> delete &amp; re-clone
              or re-scaffold — that is the delete-recreate loop and it puts your
              data at risk.
            </span>
          </li>
        </ul>
      </section>

      {/* Backend */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">
          1. Backend — redeploy, data untouched
        </h2>
        <p className="mt-4 text-muted-foreground">
          Convex is data-first. When you redeploy, it{" "}
          <span className="font-medium text-foreground">
            preserves every row in every table
          </span>
          . A deploy pushes new functions and a new schema against the database
          you already have — it does not wipe it and start over.
        </p>

        <Block>{`# from your project root
convex deploy`}</Block>

        <p className="mt-4 text-muted-foreground">
          Schema changes that come with a new version are{" "}
          <span className="font-medium text-foreground">
            additive and forward-compatible
          </span>{" "}
          by design: new tables and new optional fields are introduced without
          dropping or renaming what is already there. So updating the backend is
          usually just the one command above — your data flows straight through.
        </p>

        <div className="mt-5 rounded-lg border border-border bg-background p-5">
          <p className="text-sm font-semibold">When a change is destructive</p>
          <p className="mt-2 text-sm text-muted-foreground">
            On the rare occasion a version genuinely needs a breaking schema
            change (renaming a field, splitting a table), it ships with an{" "}
            <span className="font-medium text-foreground">
              explicit migration
            </span>{" "}
            in the release notes. You run that migration as a step — it is never
            silent, and it is never a reason to drop your tables.
          </p>
        </div>
      </section>

      {/* Frontend */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">
          2. Frontend — pull the new code in place
        </h2>
        <p className="mt-4 text-muted-foreground">
          You cloned the template once and then made it yours. To get the new
          version&apos;s code, point git at the original template repo as a
          second remote called <Code>upstream</Code> and merge its changes into
          your branch.
        </p>

        <Block>{`# one-time: register the template repo as "upstream"
git remote add upstream <template-repo-url>

# pull the new version into your working branch
git pull upstream main`}</Block>

        <p className="mt-4 text-muted-foreground">
          Git will merge cleanly where you haven&apos;t touched anything, and
          flag <span className="font-medium text-foreground">conflicts</span>{" "}
          only in files you customized. Resolve those conflicts — keep your
          branding and content, take the template&apos;s framework
          improvements — then commit the merge.
        </p>

        <Block>{`# after resolving any conflicts in your customizations
git add .
git commit

# rebuild + redeploy
pnpm build:auto`}</Block>

        <p className="mt-4 text-muted-foreground">
          <Code>build:auto</Code> rebuilds the frontend and, when a Convex
          deploy key is present, redeploys the backend in the same step — so the
          new code and the data-preserving redeploy ship together.
        </p>
      </section>

      {/* Avoid */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">
          What to avoid: the delete-recreate loop
        </h2>
        <div className="mt-4 rounded-xl border border-red-300/60 bg-red-50/60 p-6 dark:border-red-900/40 dark:bg-red-950/20">
          <p className="text-sm font-semibold text-red-900 dark:text-red-200">
            Do not delete and re-clone, and do not re-scaffold from scratch.
          </p>
          <p className="mt-3 text-sm text-red-900/80 dark:text-red-200/80">
            Tearing down a fresh copy and wiring a brand-new backend means
            standing up a new database — and that is exactly where you risk
            losing the data your old project holds. Updating{" "}
            <span className="font-medium">in place</span> — redeploy the
            backend, pull the frontend — keeps every table and every
            customization intact. It is the safe path, every time.
          </p>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Coming soon</h2>
        <p className="mt-4 text-muted-foreground">
          A <span className="font-medium text-foreground">versioned shared
          package</span> is planned for the common framework parts that every
          template has in common. Once it lands, those updates ship through{" "}
          <Code>pnpm update</Code> with{" "}
          <span className="font-medium text-foreground">zero merge conflicts</span>{" "}
          — the framework moves forward on its own version line while your repo
          only holds the parts that are genuinely yours.
        </p>
      </section>

      {/* Footer nav */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 text-sm">
        <Link
          href="/docs/setup"
          className="font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          ← Setup guide
        </Link>
        <Link
          href="/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to portal →
        </Link>
      </div>
    </div>
  );
}
