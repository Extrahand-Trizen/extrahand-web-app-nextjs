import { ImageResponse } from "next/og";
import { getApiBaseUrl } from "@/lib/config";
import { parsePublicTaskHandle, buildPublicTaskHandle } from "@/lib/utils/taskHandle";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type PageProps = { params: Promise<{ id: string }> };

async function fetchTask(idOrHandle: string): Promise<{ _id: string; title?: string; description?: string } | null> {
  const { taskId } = parsePublicTaskHandle(idOrHandle);
  const id = taskId || idOrHandle;
  if (!id) return null;

  const apiBase = getApiBaseUrl().replace(/\/$/, "");
  const url = `${apiBase}/api/v1/tasks/${id}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    const taskData = json?.data ?? json;
    if (!taskData || typeof taskData !== "object") return null;
    return {
      _id: String(taskData._id || id),
      title: typeof taskData.title === "string" ? taskData.title : undefined,
      description: typeof taskData.description === "string" ? taskData.description : undefined,
    };
  } catch {
    return null;
  }
}

function clamp(text: string, max: number): string {
  const t = (text || "").trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export default async function TaskOpenGraphImage({ params }: PageProps) {
  const { id } = await params;
  const task = await fetchTask(id);

  const title = task?.title ? clamp(task.title, 64) : "Task on ExtraHand";
  const description = task?.description
    ? clamp(task.description, 180)
    : "Browse tasks, post tasks, and get things done with ExtraHand.";

  // If user shares /tasks/<id>, we still want the canonical-looking handle rendered on the card.
  const handle = task?._id && task?.title ? buildPublicTaskHandle(task.title, task._id) : null;

  const logoUrl = new URL("../../../../public/logo.png", import.meta.url);
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
            flexDirection: "column",
            borderRadius: 44,
            border: "2px solid rgba(6,24,38,0.10)",
            background: "#FFFFFF",
            boxShadow: "0 22px 50px rgba(6,24,38,0.18)",
            padding: 56,
            gap: 28,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                background: "rgba(255,255,255,0.9)",
                border: "2px solid rgba(6,24,38,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoDataUrl} width={48} height={48} alt="ExtraHand" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: -0.6 }}>
                ExtraHand
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "rgba(6,24,38,0.70)" }}>
                Hire help or earn money near you
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                background: "#F7B728",
                color: "rgba(6,24,38,0.92)",
                fontSize: 18,
                fontWeight: 900,
              }}
            >
              {handle ? `/tasks/${handle}` : "extrahand.in"}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 950,
              letterSpacing: -1.2,
              lineHeight: 1.06,
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 30,
              fontWeight: 750,
              color: "rgba(6,24,38,0.82)",
              lineHeight: 1.25,
            }}
          >
            {description}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(6,24,38,0.06)",
                color: "rgba(6,24,38,0.70)",
                fontSize: 20,
                fontWeight: 850,
              }}
            >
              Post a task • Get offers • Pay securely
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

