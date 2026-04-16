import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoUrl = new URL("../public/logo.webp", import.meta.url);

  const logoArrayBuffer = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const logoBase64 = arrayBufferToBase64(logoArrayBuffer);
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(900px 600px at 18% 20%, rgba(247,183,40,0.38) 0%, rgba(247,183,40,0.12) 42%, rgba(247,183,40,0) 70%), linear-gradient(135deg, #F6FBFF 0%, #EAF3FF 40%, #FFF7DE 100%)",
          padding: 64,
          boxSizing: "border-box",
          color: "#061826",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            borderRadius: 44,
            border: "2px solid rgba(6,24,38,0.10)",
            background: "rgba(255,255,255,0.70)",
            boxShadow: "0 22px 50px rgba(6,24,38,0.18)",
            padding: 56,
            gap: 44,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 188,
              height: 188,
              borderRadius: 44,
              background: "rgba(255,255,255,0.9)",
              border: "2px solid rgba(6,24,38,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 14px 30px rgba(6,24,38,0.10)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoDataUrl}
              width={132}
              height={132}
              alt="ExtraHand logo"
              style={{ display: "block" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 92,
                fontWeight: 900,
                letterSpacing: -1.5,
                lineHeight: 1,
              }}
            >
              ExtraHand
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: "rgba(6,24,38,0.86)",
                lineHeight: 1.2,
              }}
            >
              Hire help or earn money near you
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 14,
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "#F7B728",
                  color: "rgba(6,24,38,0.92)",
                  fontSize: 20,
                  fontWeight: 900,
                  letterSpacing: 0.2,
                }}
              >
                extrahand.in
              </div>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "rgba(6,24,38,0.06)",
                  color: "rgba(6,24,38,0.72)",
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                Tasks • Services • Earn
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  // Edge-safe base64 encoder (no Node.js Buffer)
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

