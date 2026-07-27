import { getAuth } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // Get Bearer token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.slice(7);
    const decodedToken = await getAuth(admin).verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const { taskId, performerUid, amount, taskTitle } = await request.json();

    if (!taskId || !performerUid || !amount) {
      return NextResponse.json(
        { error: "taskId, performerUid and amount are required" },
        { status: 400 }
      );
    }

    // Call payment service
    const paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || "http://localhost:4003";
    const response = await fetch(`${paymentServiceUrl}/api/v1/payouts/task-completion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Service-Auth": process.env.SERVICE_AUTH_TOKEN || "",
        "X-Service-Name": "api-gateway",
      },
      body: JSON.stringify({
        taskId,
        performerUid,
        amount,
        taskTitle,
        userId: uid,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Return 409 for missing bank account, 400 for other errors
      const statusCode = data.requiresBankAccount ? 409 : 400;
      return NextResponse.json(data, { status: statusCode });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Payout API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
