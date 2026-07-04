"use client";

// SSG-safe Convex auth provider (fleet pattern). ConvexAuthProvider errors
// during static prerender, so it mounts client-side only. auth:* actions route
// via HTTP so sign-in works before the WebSocket is established.
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { useEffect, useState, type ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [convex] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder.convex.cloud";
    const client = new ConvexReactClient(url);
    const http = new ConvexHttpClient(url);
    const orig = client.action.bind(client);
    (client as unknown as { action: typeof client.action }).action = ((ref, args) => {
      const name = (ref as unknown as { _name?: string })?._name ?? String(ref);
      return typeof name === "string" && name.startsWith("auth:")
        ? http.action(ref, args)
        : orig(ref, args);
    }) as typeof client.action;
    return client;
  });

  useEffect(() => setMounted(true), []);
  return (
    <ConvexProvider client={convex}>
      {mounted ? <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider> : null}
    </ConvexProvider>
  );
}
