/**
 * IN-APP NOTIFICATION BY ID API ROUTE
 * Handle read, delete operations for specific notifications
 */

import { NextRequest, NextResponse } from 'next/server';

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_GATEWAY_URL ||
  'http://localhost:5000';

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

    const cookieHeader = request.headers.get('cookie') ?? '';

    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app/${notificationId}/read`,
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

    const cookieHeader = request.headers.get('cookie') ?? '';

    const response = await fetch(
      `${API_GATEWAY_URL}/api/v1/notifications/in-app/${notificationId}`,
      {
        method: 'DELETE',
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
