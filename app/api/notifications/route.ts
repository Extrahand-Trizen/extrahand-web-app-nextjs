/**
 * IN-APP NOTIFICATIONS API ROUTE
 * Proxy requests to notification service backend
 */

import { NextRequest, NextResponse } from 'next/server';

const NOTIFICATION_SERVICE_URL = 
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
  'https://extrahandnotificationservice.llp.trizenventures.com';

/**
 * GET /api/notifications
 * Fetch in-app notifications for current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';
    const skip = searchParams.get('skip') || '0';
    const unreadOnly = searchParams.get('unreadOnly') || 'false';

    // Call backend notification service
    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app?` +
      `limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
      {
        method: 'GET',
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
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { 
        success: false, 
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
      const authToken = request.cookies.get('authToken')?.value;
      
      if (!authToken) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const response = await fetch(
        `${NOTIFICATION_SERVICE_URL}/api/v1/notifications/in-app/unread-count`,
        {
          method: 'GET',
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
