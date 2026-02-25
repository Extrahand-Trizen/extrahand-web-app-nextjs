/**
 * MARK ALL NOTIFICATIONS AS READ API ROUTE
 */

import { NextRequest, NextResponse } from 'next/server';

const RAW_API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_GATEWAY_URL ||
  'http://localhost:5000';
const API_GATEWAY_URL = RAW_API_GATEWAY_URL.replace(/\/+$/, '');

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') ?? '';

    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/mark-all-read`,
      {
        method: 'PATCH',
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
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read'
      },
      { status: 500 }
    );
  }
}
