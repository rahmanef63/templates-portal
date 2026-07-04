import { ImageResponse } from "next/og";

// Generated favicon — filled Geist-blue tile with a white "F", so it stays
// visible on both light and dark browser tab bars.
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
          background: "#006bff",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        F
      </div>
    ),
    { ...size },
  );
}
