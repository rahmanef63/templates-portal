import { ImageResponse } from "next/og";

// Generated favicon — "F" mark in the Geist blue accent on near-black.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#52a8ff",
          fontFamily: "Georgia, serif",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
