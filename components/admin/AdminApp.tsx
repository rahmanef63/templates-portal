"use client";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { CircleNotch, Lock } from "@phosphor-icons/react";
import { ConvexClientProvider } from "@/components/convex-provider";
import { api } from "@/convex/_generated/api";
import Dashboard from "./Dashboard";

function Spinner() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
      <CircleNotch className="size-6 animate-spin" />
    </div>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-border-strong bg-background px-3 text-sm outline-none focus:border-accent";

function LoginForm() {
  const { signIn } = useAuthActions();
  const status = useQuery(api.setup.status);
  const firstRun = status && !status.hasAdmin;
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const fd = new FormData(e.currentTarget);
    fd.set("flow", firstRun ? "signUp" : "signIn");
    try {
      await signIn("password", fd);
    } catch {
      setErr(firstRun ? "Could not create the owner account." : "Wrong email or password.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-border bg-background p-7 shadow-[var(--shadow-card)]"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-md bg-muted text-muted-foreground">
            <Lock weight="bold" className="size-4" />
          </span>
          <div>
            <h1 className="text-[15px] font-semibold tracking-[-0.01em]">
              {firstRun ? "Create the owner account" : "Admin sign in"}
            </h1>
            <p className="text-[13px] text-faint">
              {firstRun ? "First signup claims ownership." : "Manage the template catalogue."}
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {firstRun ? (
            <input name="name" placeholder="Name" autoComplete="name" className={inputCls} />
          ) : null}
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            className={inputCls}
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            autoComplete={firstRun ? "new-password" : "current-password"}
            className={inputCls}
          />
          {err ? (
            <p role="alert" className="text-[13px] text-[#f13242]">
              {err}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || status === undefined}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? <CircleNotch className="size-4 animate-spin" /> : null}
            {firstRun ? "Create account" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Gate() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <LoginForm />;
  return <Dashboard />;
}

export default function AdminApp() {
  return (
    <ConvexClientProvider>
      <Gate />
    </ConvexClientProvider>
  );
}
