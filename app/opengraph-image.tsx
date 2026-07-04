import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

// File-based OG image — Next auto-applies it as og:image + twitter:image for
// every route. Editorial "paper & vermilion" masthead to match the site.
// Satori-safe styles only (every multi-child element is display:flex; leaves
// are single text; Georgia serif + monospace are built-in fallbacks).
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#FAF7F1";
const INK = "#26211B";
const VERMILION = "#C31800";
const MUTED = "#78716A";
const RULE = "#5A544C";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 84px",
          background: PAPER,
          color: INK,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* dateline */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: `2px solid ${RULE}`,
            paddingBottom: 20,
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: 4,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>FREE TEMPLATES — ISSUE Nº 01</div>
          <div style={{ display: "flex", color: VERMILION }}>THE CURATED INDEX</div>
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: "auto",
            fontSize: 88,
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          Production templates you clone, brand &amp;&nbsp;
          <span style={{ display: "flex", fontStyle: "italic", color: VERMILION }}>
            ship.
          </span>
        </div>

        {/* subline */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "monospace",
            fontSize: 24,
            letterSpacing: 1,
            color: MUTED,
            maxWidth: 960,
          }}
        >
          7 Next.js 16 + Convex templates · one Brand Kit · by Rahman Effendi
        </div>
      </div>
    ),
    { ...size },
  );
}
