/**
 * IN-APP NOTIFICATION BY ID API ROUTE
 * Handle read, delete operations for specific notifications
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

interface RouteParams {
  params: {
    notificationId: string;
  };
}

/**
 * PATCH /api/notifications/[notificationId]/read
 * Mark notification as read
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { notificationId } = params;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/${notificationId}/read`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders(request),
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
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark notification as read'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[notificationId]
 * Delete notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { notificationId } = params;

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/${notificationId}`,
      {
        method: 'DELETE',
        headers: buildAuthHeaders(request),
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
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete notification'
      },
      { status: 500 }
    );
  }
}
