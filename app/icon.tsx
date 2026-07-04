import { ImageResponse } from "next/og";

// Generated favicon — Geist triangle mark, matching the header wordmark.
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
          color: "#ffffff",
          fontSize: 22,
        }}
      >
        ▲
      </div>
    ),
    { ...size },
  );
}
