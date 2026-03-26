import { NextRequest, NextResponse } from "next/server";

function getUidFromRequest(request: NextRequest): string | null {
  const uid = request.headers.get("x-user-id")?.trim();
  return uid || null;
}

export async function POST(request: NextRequest) {
  try {
    const uid = getUidFromRequest(request);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      accountNumber,
      ifscCode,
      accountHolderName,
      bankName,
      email,
      phone,
      setAsDefault,
    } = await request.json();

    // Call payment service
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const response = await fetch(`${paymentServiceUrl}/api/v1/bank-accounts`, {
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
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to save bank account" },
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
    const response = await fetch(`${paymentServiceUrl}/api/v1/bank-accounts/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
        "X-User-Id": uid,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch bank accounts" },
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
