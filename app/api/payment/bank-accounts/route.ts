import { NextRequest, NextResponse } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getUidFromRequest(request: NextRequest, bodyUid?: string): string | null {
  const headerUid = request.headers.get("x-user-id")?.trim();
  if (headerUid) {
    return headerUid;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const payload = decodeJwtPayload(token);
    const tokenUid =
      (typeof payload?.user_id === "string" && payload.user_id) ||
      (typeof payload?.uid === "string" && payload.uid) ||
      (typeof payload?.sub === "string" && payload.sub) ||
      null;
    if (tokenUid) {
      return tokenUid;
    }
  }

  return bodyUid?.trim() || null;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function getBankAccountPostCandidates(baseUrl: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  const hasApiV1 = /\/api\/v1$/i.test(base);
  if (hasApiV1) {
    return [`${base}/bank-accounts`];
  }

  return [
    `${base}/api/v1/bank-accounts`,
    `${base}/bank-accounts`,
    `${base}/api/bank-accounts`,
  ];
}

function getBankAccountGetCandidates(baseUrl: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  const hasApiV1 = /\/api\/v1$/i.test(base);
  if (hasApiV1) {
    return [`${base}/bank-accounts/me`];
  }

  return [
    `${base}/api/v1/bank-accounts/me`,
    `${base}/bank-accounts/me`,
    `${base}/api/bank-accounts/me`,
  ];
}

async function fetchFirstNon404(urls: string[], init: RequestInit): Promise<Response> {
  let lastResponse: Response | null = null;

  for (const url of urls) {
    const response = await fetch(url, init);
    if (response.status !== 404) {
      return response;
    }
    lastResponse = response;
  }

  return lastResponse as Response;
}

export async function POST(request: NextRequest) {
  try {
    const {
      accountNumber,
      ifscCode,
      accountHolderName,
      bankName,
      email,
      phone,
      setAsDefault,
      userId,
    } = await request.json();

    const uid = getUidFromRequest(request, typeof userId === "string" ? userId : undefined);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call payment service
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const response = await fetchFirstNon404(getBankAccountPostCandidates(paymentServiceUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
      },
      body: JSON.stringify({
        accountNumber,
        ifscCode,
        accountHolderName,
        bankName,
        email,
        phone,
        setAsDefault,
        userId: uid,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || "Failed to save bank account",
          upstreamMessage: errorData.message || null,
          upstreamStatus: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Bank account API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const uid = getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call payment service
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const response = await fetchFirstNon404(getBankAccountGetCandidates(paymentServiceUrl), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: errorData.error || "Failed to fetch bank accounts",
          upstreamMessage: errorData.message || null,
          upstreamStatus: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Bank account fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
