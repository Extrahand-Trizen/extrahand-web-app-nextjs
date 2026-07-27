import { NextResponse } from 'next/server';

function normalizeBaseUrl(rawBaseUrl: string): string {
  return rawBaseUrl.trim().replace(/\/+$/, '');
}

function buildCandidateUrls(rawBaseUrl: string): string[] {
  const baseUrl = normalizeBaseUrl(rawBaseUrl);
  const hasApiV1 = /\/api\/v1$/i.test(baseUrl);

  if (hasApiV1) {
    return [
      `${baseUrl}/payment/razorpay-key`,
      `${baseUrl}/payments/razorpay-key`,
    ];
  }

  return [
    `${baseUrl}/api/v1/payment/razorpay-key`,
    `${baseUrl}/api/v1/payments/razorpay-key`,
  ];
}

function getEnvFallbackKeyId(): string | null {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  return keyId || null;
}

/**
 * GATEWAY: Returns the Razorpay key ID (public key) for client-side checkout.
 * Fetches from backend API Gateway (the source of truth).
 * Key ID is safe to expose; never expose RAZORPAY_KEY_SECRET.
 */
export async function GET() {
  try {
    // Prefer server-only base URL when available, fallback to public URL.
    const rawBaseUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://extrahandbackend.llp.trizenventures.com';

    const candidateUrls = buildCandidateUrls(rawBaseUrl);
    const fallbackKeyId = getEnvFallbackKeyId();
    let response: Response | null = null;

    for (const backendUrl of candidateUrls) {
      console.log('[razorpay-key] Fetching from backend:', backendUrl);

      response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Don't cache - always get fresh from backend
        cache: 'no-store',
      });

      if (response.ok) {
        break;
      }

      console.warn('[razorpay-key] Backend endpoint failed:', response.status, response.statusText);
    }

    if (!response || !response.ok) {
      if (fallbackKeyId) {
        console.warn('[razorpay-key] Falling back to NEXT_PUBLIC_RAZORPAY_KEY_ID');
        return NextResponse.json(
          { keyId: fallbackKeyId, source: 'env-fallback' },
          { headers: { 'Cache-Control': 'public, max-age=3600' } }
        );
      }

      return NextResponse.json(
        {
          error: 'Failed to fetch Razorpay key from backend',
          details: `All candidate endpoints failed${response ? ` (last status: ${response.status})` : ''}`,
        },
        { status: response?.status || 502 }
      );
    }

    const data = await response.json();
    
    if (!data?.keyId) {
      console.error('[razorpay-key] No keyId in backend response:', data);

      if (fallbackKeyId) {
        console.warn('[razorpay-key] Backend payload invalid, using NEXT_PUBLIC_RAZORPAY_KEY_ID fallback');
        return NextResponse.json(
          { keyId: fallbackKeyId, source: 'env-fallback' },
          { headers: { 'Cache-Control': 'public, max-age=3600' } }
        );
      }

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

    const fallbackKeyId = getEnvFallbackKeyId();
    if (fallbackKeyId) {
      console.warn('[razorpay-key] Exception while fetching backend key, using NEXT_PUBLIC_RAZORPAY_KEY_ID fallback');
      return NextResponse.json(
        { keyId: fallbackKeyId, source: 'env-fallback' },
        { headers: { 'Cache-Control': 'public, max-age=3600' } }
      );
    }

    return NextResponse.json(
      { error: 'Error fetching Razorpay key', details: error.message },
      { status: 500 }
    );
  }
}
