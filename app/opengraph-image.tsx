import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

// File-based OG image — Next auto-applies it as the og:image + twitter:image
// for every route. Dark, violet-accented to match the site. Satori-safe styles
// only (every multi-child element is display:flex; leaves are single text).
export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0d0d0f",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#059669,#10b981)",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <div style={{ fontSize: 28, color: "#a1a1aa" }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", fontSize: 78, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2, maxWidth: 960 }}>
          Discover, demo &amp; ship your templates.
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", marginTop: 30, maxWidth: 940 }}>
          7 production-ready Next.js + Convex templates · one Brand Kit · live in minutes
        </div>
      </div>
    ),
    { ...size },
  );
}
