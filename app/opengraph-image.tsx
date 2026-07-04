import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

// File-based OG image — Geist dark aesthetic (near-black, one blue accent).
// Satori-safe: every multi-child element is display:flex; leaves are single text.
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#ededed";
const ACCENT = "#52a8ff";
const MUTED = "#a0a0a0";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "84px",
          background: BG,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: INK,
              color: BG,
              fontSize: 24,
            }}
          >
            ▲
          </div>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>{SITE_NAME}</div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 74,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          Production templates you clone, brand &amp;&nbsp;
          <span style={{ display: "flex", color: ACCENT }}>ship.</span>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: MUTED, marginTop: 28, maxWidth: 940 }}>
          7 Next.js 16 + Convex templates · one Brand Kit · by Rahman Fakhrul
        </div>
      </div>
    ),
    { ...size },
  );
}
