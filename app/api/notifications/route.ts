/**
 * IN-APP NOTIFICATIONS API ROUTE
 * Proxy requests to notification service backend
 */

import { NextRequest, NextResponse } from 'next/server';

// Use API Gateway as the single entry point.
// In production this should be set to the public API gateway URL.
const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_GATEWAY_URL ||
  'http://localhost:5000';

/**
 * GET /api/notifications
 * Fetch in-app notifications for current user
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const skip = searchParams.get('skip') || '0';
    const unreadOnly = searchParams.get('unreadOnly') || 'false';

    // Forward cookies from the incoming request so the API gateway
    // receives the accessToken / session cookies.
    const cookieHeader = request.headers.get('cookie') ?? '';

    // Call API Gateway -> Notification Service
    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app?` +
      `limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookieHeader && { cookie: cookieHeader })
        }
      }
    );

    if (!response.ok) {
      console.error(`Notification service error: ${response.statusText}`);
      return NextResponse.json(
        { success: false, error: `Service error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { 
        success: false, 
        notifications: [],
        error: error instanceof Error ? error.message : 'Failed to fetch notifications'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
export async function GET_UNREAD(request: NextRequest) {
  if (request.nextUrl.pathname.includes('unread-count')) {
    try {
      const cookieHeader = request.headers.get('cookie') ?? '';

      const response = await fetch(
        `${API_GATEWAY_URL}/api/v1/notifications/in-app/unread-count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(cookieHeader && { cookie: cookieHeader })
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Notification service error: ${response.statusText}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch unread count'
        },
        { status: 500 }
      );
    }
  }
  return GET(request);
}
