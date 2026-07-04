import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { TEMPLATES as SEED } from "@/data/templates";
import { MAKER, SITE_NAME, SITE_DESC } from "@/app/site";

// Single content-access layer, read server-side from self-hosted Convex with a
// fallback to the in-repo seed (keeps the site up if Convex is unset/unreachable).
// The admin panel writes the same tables; edits go live on next navigation.

export type Template = {
  slug: string;
  title: string;
  vertical: string;
  blurb: string;
  demo: string;
  repo: string;
  thumb: string;
  features: string[];
};

export type Settings = {
  siteName: string;
  siteDesc: string;
  makerName: string;
  makerRole: string;
  makerHandle: string;
  makerSite: string;
  makerGithub: string;
  makerResources: string;
};

const SEED_SETTINGS: Settings = {
  siteName: SITE_NAME,
  siteDesc: SITE_DESC,
  makerName: MAKER.name,
  makerRole: MAKER.role,
  makerHandle: MAKER.handle,
  makerSite: MAKER.site,
  makerGithub: MAKER.github,
  makerResources: MAKER.resources,
};

function client() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  return url ? new ConvexHttpClient(url) : null;
}

export async function getTemplates(): Promise<Template[]> {
  const c = client();
  if (!c) return SEED;
  try {
    const rows = await c.query(api.templates.list, {});
    if (!rows.length) return SEED;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      vertical: r.vertical,
      blurb: r.blurb,
      demo: r.demo,
      repo: r.repo,
      thumb: r.thumb,
      features: r.features,
    }));
  } catch {
    return SEED;
  }
}

export async function getSettings(): Promise<Settings> {
  const c = client();
  if (!c) return SEED_SETTINGS;
  try {
    const s = await c.query(api.settings.get, {});
    if (!s) return SEED_SETTINGS;
    return {
      siteName: s.siteName ?? SEED_SETTINGS.siteName,
      siteDesc: s.siteDesc ?? SEED_SETTINGS.siteDesc,
      makerName: s.makerName ?? SEED_SETTINGS.makerName,
      makerRole: s.makerRole ?? SEED_SETTINGS.makerRole,
      makerHandle: s.makerHandle ?? SEED_SETTINGS.makerHandle,
      makerSite: s.makerSite ?? SEED_SETTINGS.makerSite,
      makerGithub: s.makerGithub ?? SEED_SETTINGS.makerGithub,
      makerResources: s.makerResources ?? SEED_SETTINGS.makerResources,
    };
  } catch {
    return SEED_SETTINGS;
  }
}
