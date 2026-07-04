import { ImageResponse } from "next/og";

// Generated favicon — vermilion serif "F" matching the masthead wordmark.
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
          background: "#EF5A3D",
          color: "#171310",
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
