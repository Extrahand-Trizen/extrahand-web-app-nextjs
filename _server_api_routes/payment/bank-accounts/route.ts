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

function getGatewayBankAccountPostCandidates(baseUrl: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  return [
    `${base}/api/v1/payment/bank-accounts`,
    `${base}/payment/bank-accounts`,
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

function getGatewayBankAccountGetCandidates(baseUrl: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  return [
    `${base}/api/v1/payment/bank-accounts/me`,
    `${base}/payment/bank-accounts/me`,
  ];
}

function getBankAccountDeleteCandidates(baseUrl: string, bankAccountId: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  const hasApiV1 = /\/api\/v1$/i.test(base);
  if (hasApiV1) {
    return [`${base}/bank-accounts/${bankAccountId}`];
  }

  return [
    `${base}/api/v1/bank-accounts/${bankAccountId}`,
    `${base}/bank-accounts/${bankAccountId}`,
    `${base}/api/bank-accounts/${bankAccountId}`,
  ];
}

function getGatewayBankAccountDeleteCandidates(baseUrl: string, bankAccountId: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  return [
    `${base}/api/v1/payment/bank-accounts/${bankAccountId}`,
    `${base}/payment/bank-accounts/${bankAccountId}`,
  ];
}

function getBankAccountSetDefaultCandidates(baseUrl: string, bankAccountId: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  const hasApiV1 = /\/api\/v1$/i.test(base);
  if (hasApiV1) {
    return [`${base}/bank-accounts/${bankAccountId}/default`];
  }

  return [
    `${base}/api/v1/bank-accounts/${bankAccountId}/default`,
    `${base}/bank-accounts/${bankAccountId}/default`,
    `${base}/api/bank-accounts/${bankAccountId}/default`,
  ];
}

function getGatewayBankAccountSetDefaultCandidates(baseUrl: string, bankAccountId: string): string[] {
  const base = normalizeBaseUrl(baseUrl);
  return [
    `${base}/api/v1/payment/bank-accounts/${bankAccountId}/default`,
    `${base}/payment/bank-accounts/${bankAccountId}/default`,
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
    const apiGatewayUrl = process.env.API_GATEWAY_URL;
    const postCandidates = [
      ...getBankAccountPostCandidates(paymentServiceUrl),
      ...(apiGatewayUrl ? getGatewayBankAccountPostCandidates(apiGatewayUrl) : []),
    ];
    const authHeader = request.headers.get("authorization");
    const response = await fetchFirstNon404(postCandidates, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
        ...(authHeader ? { Authorization: authHeader } : {}),
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
    const apiGatewayUrl = process.env.API_GATEWAY_URL;
    const getCandidates = [
      ...getBankAccountGetCandidates(paymentServiceUrl),
      ...(apiGatewayUrl ? getGatewayBankAccountGetCandidates(apiGatewayUrl) : []),
    ];
    const authHeader = request.headers.get("authorization");
    const response = await fetchFirstNon404(getCandidates, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
        ...(authHeader ? { Authorization: authHeader } : {}),
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const bankAccountId =
      (typeof body?.bankAccountId === "string" && body.bankAccountId) ||
      request.nextUrl.searchParams.get("bankAccountId") ||
      "";

    if (!bankAccountId) {
      return NextResponse.json({ error: "bankAccountId is required" }, { status: 400 });
    }

    const uid = getUidFromRequest(request, typeof body?.userId === "string" ? body.userId : undefined);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const apiGatewayUrl = process.env.API_GATEWAY_URL;
    const candidates = [
      ...getBankAccountDeleteCandidates(paymentServiceUrl, bankAccountId),
      ...(apiGatewayUrl ? getGatewayBankAccountDeleteCandidates(apiGatewayUrl, bankAccountId) : []),
    ];
    const authHeader = request.headers.get("authorization");
    const response = await fetchFirstNon404(candidates, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ userId: uid }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to delete bank account",
          upstreamMessage: data.message || null,
          upstreamStatus: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bank account delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const bankAccountId =
      (typeof body?.bankAccountId === "string" && body.bankAccountId) ||
      request.nextUrl.searchParams.get("bankAccountId") ||
      "";

    if (!bankAccountId) {
      return NextResponse.json({ error: "bankAccountId is required" }, { status: 400 });
    }

    const uid = getUidFromRequest(request, typeof body?.userId === "string" ? body.userId : undefined);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const apiGatewayUrl = process.env.API_GATEWAY_URL;
    const candidates = [
      ...getBankAccountSetDefaultCandidates(paymentServiceUrl, bankAccountId),
      ...(apiGatewayUrl ? getGatewayBankAccountSetDefaultCandidates(apiGatewayUrl, bankAccountId) : []),
    ];
    const authHeader = request.headers.get("authorization");
    const response = await fetchFirstNon404(candidates, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({ userId: uid }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error || "Failed to set default bank account",
          upstreamMessage: data.message || null,
          upstreamStatus: response.status,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Set default bank account error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
