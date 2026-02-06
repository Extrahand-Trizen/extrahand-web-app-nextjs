import { NextResponse } from 'next/server';

/**
 * Returns the Razorpay key ID (public key) for client-side checkout.
 * Key ID is safe to expose; never expose RAZORPAY_KEY_SECRET.
 * Reads from RAZORPAY_KEY_ID or NEXT_PUBLIC_RAZORPAY_KEY_ID (server env).
 */
export async function GET() {
  const keyId =
    process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

  if (!keyId.trim()) {
    return NextResponse.json(
      { error: 'Razorpay key not configured', keyId: null },
      { status: 500 }
    );
  }

  return NextResponse.json({ keyId: keyId.trim() });
}
