/**
 * UNREAD NOTIFICATION COUNT API ROUTE
 * Proxies unread count to API Gateway with auth.
 */

import { NextRequest, NextResponse } from 'next/server';

const RAW_API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_GATEWAY_URL ||
  'http://localhost:5000';
const API_GATEWAY_URL = RAW_API_GATEWAY_URL.replace(/\/+$/, '');

const ACCESS_COOKIE_NAME =
  process.env.ACCESS_TOKEN_COOKIE_NAME || 'accessToken';

function getAccessTokenFromRequest(request: NextRequest): string | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${ACCESS_COOKIE_NAME}=`)) {
      const value = part.slice(ACCESS_COOKIE_NAME.length + 1).trim();
      return value ? decodeURIComponent(value) : null;
    }
  }
  return null;
}

function buildAuthHeaders(request: NextRequest): HeadersInit {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookieHeader && { cookie: cookieHeader }),
  };
  const token = getAccessTokenFromRequest(request);
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function extractUnreadCount(raw: unknown): number {
  if (typeof raw !== 'object' || raw === null) return 0;

  const direct = (raw as { unreadCount?: unknown }).unreadCount;
  if (typeof direct === 'number') return direct;

  const nested = (raw as { data?: { unreadCount?: unknown } }).data?.unreadCount;
  if (typeof nested === 'number') return nested;

  return 0;
}

/**
 * GET /api/notifications/unread-count
 * Fetch unread in-app notification count for current user.
 */
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/unread-count`,
      {
        method: 'GET',
        headers: buildAuthHeaders(request),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, unreadCount: 0, error: `Service error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: data?.success !== false,
      unreadCount: extractUnreadCount(data),
    });
  } catch (error) {
    console.error('Error fetching unread notification count:', error);
    return NextResponse.json(
      {
        success: false,
        unreadCount: 0,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch unread notification count',
      },
      { status: 500 }
    );
  }
}
