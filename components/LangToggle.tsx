"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/app/dictionaries";

// Sets the `lang` cookie and refreshes so Server Components re-render in the
// chosen language. No context, no store — the cookie IS the state.
export default function LangToggle({ current }: { current: Lang }) {
  const router = useRouter();
  const set = (lang: Lang) => {
    if (lang === current) return;
    document.cookie = `lang=${lang};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };
  return (
    <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em]">
      {(["en", "id"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border" aria-hidden>·</span>}
          <button
            type="button"
            onClick={() => set(l)}
            aria-pressed={current === l}
            className={
              current === l
                ? "text-primary"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
