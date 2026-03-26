import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: { payoutId: string } }
) {
  try {
    // Get Bearer token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    await getAuth(admin).verifyIdToken(idToken); // Verify user is authenticated

    const { payoutId } = params;

    if (!payoutId) {
      return NextResponse.json({ error: "payoutId is required" }, { status: 400 });
    }

    // Call payment service
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const response = await fetch(`${paymentServiceUrl}/api/v1/payouts/status/${payoutId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Payout not found" },
        { status: 404 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Payout status API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
