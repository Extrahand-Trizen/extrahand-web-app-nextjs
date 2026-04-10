import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type PageProps = { params: Promise<{ id: string }> };

export default async function ProfileOpenGraphImage({ params }: PageProps) {
  const { id } = await params;
  const safeHandle = (id || "").trim();

  const logoUrl = new URL("../../../../public/logo.webp", import.meta.url);
  const logoArrayBuffer = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const logoDataUrl = `data:image/png;base64,${arrayBufferToBase64(logoArrayBuffer)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FFFFFF",
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
            borderRadius: 42,
            border: "2px solid rgba(6,24,38,0.12)",
            background: "#FFFFFF",
            boxShadow: "0 18px 44px rgba(6,24,38,0.12)",
            padding: 52,
            gap: 34,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 170,
              height: 170,
              borderRadius: 36,
              background: "#FFFFFF",
              border: "2px solid rgba(6,24,38,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUrl} width={118} height={118} alt="ExtraHand" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontSize: 78,
                fontWeight: 900,
                letterSpacing: -1.2,
                lineHeight: 1.04,
              }}
            >
              ExtraHand
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "rgba(6,24,38,0.82)",
                lineHeight: 1.2,
                maxWidth: 760,
              }}
            >
              Connect with skilled taskers and get things done. Post tasks, hire services, and become a tasker on ExtraHand.
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 12,
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
                }}
              >
                extrahand.in
              </div>
              {safeHandle ? (
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: "rgba(6,24,38,0.06)",
                    color: "rgba(6,24,38,0.70)",
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  /profile/{safeHandle}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

