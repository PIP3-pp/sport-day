import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

const COLORS = ["#EF4444", "#22C55E", "#38BDF8", "#A855F7"];

/** App icon: the four team colors under a dark tile. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", height: 96 }}>
          {COLORS.map((color) => (
            <div key={color} style={{ flex: 1, background: color }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
