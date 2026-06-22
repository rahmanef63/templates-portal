import type { Metadata } from "next";
import Builder from "@/components/builder/Builder";

// /t/custom — the visual page builder. Static route shadows the generic
// /t/[slug] detail page. The builder produces a portable PageConfig (the SSOT)
// that the same REGISTRY + BlockRenderer renders identically inside templates.
export const metadata: Metadata = {
  title: "Custom OS",
  description:
    "Build a website from the shared block library. Add blocks, edit content, reorder, and export a portable page config any template can render.",
  openGraph: {
    title: "Custom OS",
    description: "Visual page builder over the shared block library.",
  },
};

export default function CustomBuilderPage() {
  return <Builder />;
}
