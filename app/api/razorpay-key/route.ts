import { NextResponse } from 'next/server';

/**
 * GATEWAY: Returns the Razorpay key ID (public key) for client-side checkout.
 * Fetches from backend API Gateway (the source of truth).
 * Key ID is safe to expose; never expose RAZORPAY_KEY_SECRET.
 */
export async function GET() {
  try {
    // Get API base URL from config
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://extrahandbackend.llp.trizenventures.com';
    const backendUrl = `${API_BASE_URL}/api/v1/payment/razorpay-key`;

    console.log('[razorpay-key] Fetching from backend:', backendUrl);

    // Fetch from backend API Gateway
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache - always get fresh from backend
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('[razorpay-key] Backend error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch Razorpay key from backend', details: await response.text() },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data?.keyId) {
      console.error('[razorpay-key] No keyId in backend response:', data);
      return NextResponse.json(
        { error: 'No Razorpay key returned from backend' },
        { status: 500 }
      );
    }

    console.log('[razorpay-key] Successfully fetched from backend');
    
    // Cache the response in browser for 1 hour
    const headers = {
      'Cache-Control': 'public, max-age=3600',
    };

    return NextResponse.json({ keyId: data.keyId }, { headers });
  } catch (error: any) {
    console.error('[razorpay-key] Error fetching from backend:', error.message);
    return NextResponse.json(
      { error: 'Error fetching Razorpay key', details: error.message },
      { status: 500 }
    );
  }
}
