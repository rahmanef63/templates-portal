import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";
import { getTemplates } from "@/lib/content";

// File-based OG image — recreates the site HERO as the share thumbnail:
// editorial headline on the left, a framed template-preview panel on the right,
// Geist-recolored (near-black + one blue accent). Satori-safe (flex everywhere).
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const PANEL = "#0b0b0b";
const INK = "#ededed";
const ACCENT = "#52a8ff";
const MUTED = "#a0a0a0";
const RULE = "#454545";
const BORDER = "#2e2e2e";

export default async function OpengraphImage() {
  const templates = await getTemplates().catch(() => []);
  const lead = templates[0] ?? {
    title: "Personal Brand OS",
    vertical: "Personal brand / portfolio",
  };

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
            padding: "26px 64px",
            borderBottom: `2px solid ${RULE}`,
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: 3,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>FREE TEMPLATES — ISSUE Nº 01</div>
          <div style={{ display: "flex" }}>FREE-TEMPLATE.RAHMANEF.COM</div>
        </div>

        {/* hero body: headline + preview panel */}
        <div style={{ display: "flex", flex: 1, padding: "48px 64px", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1.1 }}>
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 18, letterSpacing: 4, color: ACCENT }}>
              THE CURATED INDEX
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: 20,
                fontSize: 62,
                fontWeight: 500,
                lineHeight: 1.03,
                letterSpacing: -2,
              }}
            >
              Production templates you clone, brand &amp;&nbsp;
              <span style={{ display: "flex", fontStyle: "italic", color: ACCENT }}>ship.</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontFamily: "monospace",
                fontSize: 19,
                lineHeight: 1.5,
                color: MUTED,
                maxWidth: 520,
              }}
            >
              7 Next.js 16 + Convex templates · one Brand Kit · by Rahman Fakhrul
            </div>
          </div>

          {/* framed preview panel — mirrors the hero figure */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 0.9,
              border: `1px solid ${RULE}`,
              background: PANEL,
              padding: 32,
              height: 300,
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontFamily: "monospace", fontSize: 16, letterSpacing: 3, color: MUTED }}>
              FIG. 01
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 500, letterSpacing: -1, lineHeight: 1.05 }}>
                {lead.title}
              </div>
              <div style={{ display: "flex", marginTop: 14, fontFamily: "monospace", fontSize: 16, letterSpacing: 2, color: MUTED }}>
                {lead.vertical.toUpperCase()}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 16, letterSpacing: 2, borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
              <span style={{ display: "flex", color: MUTED }}>READ THE ENTRY</span>
              <span style={{ display: "flex", color: ACCENT }}>LIVE DEMO ↗</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
