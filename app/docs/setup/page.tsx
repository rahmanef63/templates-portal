import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Setup guide",
  description:
    "Idempotent, no-nuke setup for your template — provision Convex, deploy, and claim admin. Misconfig? Re-run the steps; you never delete the Convex project.",
};

type Step = {
  n: number;
  title: string;
  body: React.ReactNode;
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-muted/60 p-4 text-sm leading-relaxed">
      <code className="font-mono text-foreground">{children}</code>
    </pre>
  );
}

function Var({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

const STEPS: Step[] = [
  {
    n: 1,
    title: "Grab your Convex URL + a full-permission deploy key",
    body: (
      <>
        <p className="text-muted-foreground">
          In the{" "}
          <a
            href="https://dashboard.convex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Convex dashboard
          </a>
          , open your project and copy the{" "}
          <strong className="font-semibold text-foreground">
            deployment URL
          </strong>
          . Then generate a{" "}
          <strong className="font-semibold text-foreground">
            production deploy key
          </strong>{" "}
          with full permissions:
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>
            <Var>deployment:deploy</Var> — push functions &amp; schema
          </li>
          <li>
            <Var>env:view</Var> — read existing backend env vars
          </li>
          <li>
            <Var>env:write</Var> — let the build provision auth env vars for you
          </li>
        </ul>
        <p className="mt-3 text-muted-foreground">
          The <Var>env:write</Var> scope is what makes the auth bootstrap
          (step 4) zero-touch. A read-only key will make the build fail trying
          to write JWT keys.
        </p>
      </>
    ),
  },
  {
    n: 2,
    title: "Set the two env vars in Vercel",
    body: (
      <>
        <p className="text-muted-foreground">
          In your Vercel project → Settings → Environment Variables, add both
          for the Production environment:
        </p>
        <Code>{`NEXT_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
CONVEX_DEPLOY_KEY=<your-full-permission-deploy-key>`}</Code>
        <p className="mt-3 text-muted-foreground">
          <Var>NEXT_PUBLIC_CONVEX_URL</Var> is what the browser uses to talk to
          Convex; <Var>CONVEX_DEPLOY_KEY</Var> is what the build uses to deploy
          the backend before <Var>next build</Var> runs.
        </p>
      </>
    ),
  },
  {
    n: 3,
    title: "Pick how the first admin gets created",
    body: (
      <>
        <p className="text-muted-foreground">
          A fresh Convex backend has an{" "}
          <strong className="font-semibold text-foreground">
            empty users table
          </strong>
          , so it needs exactly one first admin. Choose either path:
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <h4 className="text-sm font-semibold">
              A. Zero-touch (set env vars)
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Set these in your{" "}
              <strong className="font-medium text-foreground">Convex</strong>{" "}
              env (dashboard → Settings → Environment Variables). The first
              admin is created automatically on deploy:
            </p>
            <Code>{`ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<a-strong-password>`}</Code>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <h4 className="text-sm font-semibold">B. Claim ownership in-app</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Skip the env vars. After deploy, visit{" "}
              <Var>/dashboard/admin</Var> and click{" "}
              <strong className="font-medium text-foreground">
                Claim ownership
              </strong>{" "}
              — the first account to sign up becomes the admin.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    n: 4,
    title: "Push — the build provisions auth and deploys",
    body: (
      <>
        <p className="text-muted-foreground">
          Push to your default branch (or hit Deploy in Vercel). The build
          command runs three steps in order, all idempotent:
        </p>
        <Code>{`setup-auth   # provisions JWT_PRIVATE_KEY, JWKS, SITE_URL in Convex
convex deploy   # pushes schema + functions to your backend
next build      # builds the Next.js app with NEXT_PUBLIC_CONVEX_URL`}</Code>
        <p className="mt-3 text-muted-foreground">
          <Var>setup-auth</Var> only writes env vars that are missing, so
          re-running it never rotates keys or breaks existing sessions.
        </p>
      </>
    ),
  },
  {
    n: 5,
    title: "Optional — load sample data",
    body: (
      <>
        <p className="text-muted-foreground">
          Want content to look at before adding your own? Sign in as the admin
          and click{" "}
          <strong className="font-semibold text-foreground">
            Load sample data
          </strong>{" "}
          in the admin panel, or run the seed from your machine:
        </p>
        <Code>{`npx convex run seed:run`}</Code>
        <p className="mt-3 text-muted-foreground">
          The seed is idempotent too — re-running it tops up missing rows rather
          than duplicating everything.
        </p>
      </>
    ),
  },
];

export default function SetupPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>{" "}
        <span aria-hidden>/</span> <span className="text-foreground">Setup</span>
      </nav>

      <header className="border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Setup guide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          An idempotent, no-nuke setup. Five steps take you from a cloned
          template to a live, admin-controlled site backed by Convex.
        </p>
      </header>

      {/* No-nuke emphasis */}
      <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
        <h2 className="text-base font-semibold tracking-tight">
          You never delete the Convex project
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every step here is safe to repeat. If something is misconfigured — a
          wrong env var, a missing key, a half-finished deploy — the fix is to{" "}
          <strong className="font-semibold text-foreground">
            re-run these steps
          </strong>
          , not to delete and recreate the Convex project. The build only writes
          what is missing, so re-running converges to a correct state instead of
          starting over.
        </p>
      </div>

      {/* Steps */}
      <ol className="mt-12 space-y-12">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-5">
            <div
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              {step.n}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight">
                {step.title}
              </h2>
              <div className="mt-3">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>

      {/* Read-only callout */}
      <div className="mt-16 rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="text-base font-semibold tracking-tight">
          Why does my fresh clone look read-only?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Because it is — on purpose. A fresh Convex backend ships with an{" "}
          <strong className="font-semibold text-foreground">
            empty users table
          </strong>
          . Until you become the first admin — by setting{" "}
          <Var>ADMIN_EMAIL</Var> / <Var>ADMIN_PASSWORD</Var> (step 3A) or by
          signing up and claiming ownership (step 3B) — there is no
          authenticated user, so every edit and mutation is blocked.
        </p>
        <p className="mt-3 text-muted-foreground">
          That locked-down state is{" "}
          <strong className="font-semibold text-foreground">
            expected, not a bug
          </strong>
          . As soon as the first admin exists, the dashboard becomes fully
          writable. Nothing to delete, nothing to recreate — just finish step 3.
        </p>
      </div>

      <footer className="mt-16 border-t border-border pt-8">
        <Link
          href="/"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          ← Back to templates
        </Link>
      </footer>
    </div>
  );
}
