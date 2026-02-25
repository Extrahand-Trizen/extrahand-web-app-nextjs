/**
 * IN-APP NOTIFICATION BY ID API ROUTE
 * Handle read, delete operations for specific notifications
 */

import { NextRequest, NextResponse } from 'next/server';

const NOTIFICATION_SERVICE_URL = 
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
  'https://extrahandnotificationservice.llp.trizenventures.com';

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
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app/${notificationId}/read`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Notification service error: ${response.statusText}`);
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
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app/${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Notification service error: ${response.statusText}`);
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
