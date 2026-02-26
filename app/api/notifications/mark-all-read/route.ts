/**
 * MARK ALL NOTIFICATIONS AS READ API ROUTE
 * Proxies to API Gateway with auth so backend can mark all in-app notifications as read.
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

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') ?? '';
    const accessToken = getAccessTokenFromRequest(request);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(cookieHeader && { cookie: cookieHeader }),
    };
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/mark-all-read`,
      {
        method: 'PATCH',
        headers,
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(
        `Mark all read failed: ${response.status} ${response.statusText}`,
        text.slice(0, 200)
      );
      return NextResponse.json(
        {
          success: false,
          error: `Service error: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to mark all notifications as read',
      },
      { status: 500 }
    );
  }
}
