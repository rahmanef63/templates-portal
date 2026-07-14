import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";
import { getTemplates } from "@/lib/content";

// File-based OG image — the whole catalog "lit up": every template as an active,
// accent-lit card in a grid, instead of one hero preview. Satori-safe (flex only,
// solid colors, no images). Geist-recolored (near-black + one blue accent).
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const PANEL = "#101010";
const INK = "#ededed";
const ACCENT = "#52a8ff";
const MUTED = "#a0a0a0";
const RULE = "#454545";
const BORDER = "#2e2e2e";

const FALLBACK = [
  { title: "Personal Brand OS", vertical: "Personal brand" },
  { title: "SaaS Marketing OS", vertical: "SaaS marketing" },
  { title: "Agency Studio OS", vertical: "Creative agency" },
];

export default async function OpengraphImage() {
  const rows = await getTemplates().catch(() => []);
  const templates = (rows.length ? rows : FALLBACK).slice(0, 9);
  const pad = (n: number) => String(n).padStart(2, "0");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: BG,
          color: INK,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* masthead dateline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "22px 56px",
            borderBottom: `2px solid ${RULE}`,
            fontFamily: "monospace",
            fontSize: 17,
            letterSpacing: 3,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>FREE TEMPLATES — ISSUE Nº 01</div>
          <div style={{ display: "flex" }}>FREE-TEMPLATE.RAHMANEF.COM</div>
        </div>

        {/* compact header: eyebrow + count */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "24px 56px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 16, letterSpacing: 4, color: ACCENT }}>
              THE CURATED INDEX
            </div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 40, fontWeight: 500, letterSpacing: -1 }}>
              Every template, clone &amp; ship.
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "monospace", fontSize: 16, letterSpacing: 2, color: MUTED }}>
            {pad(templates.length)} · NEXT.JS 16 + CONVEX
          </div>
        </div>

        {/* the catalog, lit — every template as an active accent card */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, padding: "0 56px 40px", flex: 1 }}>
          {templates.map((tpl, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 336,
                minHeight: 118,
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderLeft: `4px solid ${ACCENT}`,
                padding: "16px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", fontFamily: "monospace", fontSize: 15, letterSpacing: 2, color: ACCENT }}>
                  {pad(i + 1)}
                </div>
                <div style={{ display: "flex", width: 8, height: 8, borderRadius: 8, background: ACCENT }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 25, fontWeight: 500, letterSpacing: -0.5, lineHeight: 1.1 }}>
                  {tpl.title}
                </div>
                <div style={{ display: "flex", marginTop: 6, fontFamily: "monospace", fontSize: 13, letterSpacing: 1.5, color: MUTED }}>
                  {tpl.vertical.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
