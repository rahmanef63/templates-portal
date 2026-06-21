import { ImageResponse } from "next/og";

// Generated favicon — the violet "P" mark matching the nav logo.
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
          borderRadius: 7,
          background: "linear-gradient(135deg,#7c3aed,#d946ef)",
          color: "white",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        P
      </div>
    ),
    { ...size },
  );
}
