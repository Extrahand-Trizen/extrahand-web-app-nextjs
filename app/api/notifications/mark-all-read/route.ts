/**
 * MARK ALL NOTIFICATIONS AS READ API ROUTE
 */

import { NextRequest, NextResponse } from 'next/server';

const NOTIFICATION_SERVICE_URL = 
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
  'https://extrahandnotificationservice.llp.trizenventures.com';

/**
 * PATCH /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function PATCH(request: NextRequest) {
  try {
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app/mark-all-read`,
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
