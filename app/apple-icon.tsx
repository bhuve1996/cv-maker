import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6d5ce8 0%, #5b4fd6 100%)",
          borderRadius: 36,
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 9h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Z"
            fill="white"
            fillOpacity="0.95"
          />
          <path
            d="M12 13h8M12 16.5h6M12 20h4"
            stroke="#6d5ce8"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
