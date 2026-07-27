/**
 * Health Check API Endpoint
 * Used by container health checks and monitoring
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - can be extended with database/API checks
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'extrahand-web-app-nextjs',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
