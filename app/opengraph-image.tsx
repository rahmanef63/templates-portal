import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

// File-based OG image — editorial masthead, recolored to the Geist palette
// (near-black + one blue accent). Satori-safe: multi-child elements are flex.
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#ededed";
const ACCENT = "#52a8ff";
const MUTED = "#a0a0a0";
const RULE = "#454545";

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
          background: BG,
          color: INK,
          fontFamily: "Georgia, serif",
        }}
      >
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
          <div style={{ display: "flex", color: ACCENT }}>THE CURATED INDEX</div>
        </div>

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
          <span style={{ display: "flex", fontStyle: "italic", color: ACCENT }}>ship.</span>
        </div>

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
          7 Next.js 16 + Convex templates · one Brand Kit · by Rahman Fakhrul
        </div>
      </div>
    ),
    { ...size },
  );
}
