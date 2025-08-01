import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '~/server/db';
import { events, claims } from '~/server/db/schema';
import type { ChronoStamp } from '~/stores/useAppStore';
import { signMessage, generateNonce, validateSignerConfig } from '~/lib/signer';
import { env } from '~/env';

// Helper function to format time for multiple timezones
function formatTimeMessage(date: Date, userTimeZone?: string): string {
  const aestTime = date.toLocaleString('en-US', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // If user timezone is provided and different from AEST, show both
  if (userTimeZone && userTimeZone !== 'Australia/Sydney') {
    try {
      const localTime = date.toLocaleString('en-US', {
        timeZone: userTimeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      // Get timezone abbreviation
      const userTzName = getUserTimeZoneName(userTimeZone);
      return `${localTime} ${userTzName} (${aestTime} AEST)`;
    } catch {
      // Fallback to AEST only if timezone is invalid
      return `${aestTime} AEST`;
    }
  }
  
  return `${aestTime} AEST`;
}

// Helper to get common timezone abbreviations
function getUserTimeZoneName(timeZone: string): string {
  const tzMap: Record<string, string> = {
    'America/New_York': 'EST',
    'America/Chicago': 'CST', 
    'America/Denver': 'MST',
    'America/Los_Angeles': 'PST',
    'Europe/London': 'GMT',
    'Europe/Paris': 'CET',
    'Asia/Tokyo': 'JST',
    'Asia/Shanghai': 'CST',
    'Australia/Sydney': 'AEST',
    'Australia/Melbourne': 'AEST',
  };
  
  return tzMap[timeZone] || 'Local';
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { 
      eventCode?: string; 
      userAddress?: string;
      userTimeZone?: string; // Optional: user's timezone for localized error messages
    };
    const { eventCode, userAddress, userTimeZone } = body;

    // Validate required fields
    if (!eventCode || !userAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Event code and user address are required'
        },
        { status: 400 }
      );
    }

    // Find the event by code
    const event = await db.query.events.findFirst({
      where: eq(events.eventCode, eventCode.toUpperCase()),
    });

    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found',
          message: `No event found with code: ${eventCode}`
        },
        { status: 404 }
      );
    }

    // Check if user already claimed this event
    const existingClaim = await db.query.claims.findFirst({
      where: and(
        eq(claims.userAddress, userAddress),
        eq(claims.eventId, event.id)
      ),
    });
    
    if (existingClaim) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Already claimed',
          message: 'You have already claimed a ChronoStamp for this event'
        },
        { status: 409 }
      );
    }

    // Check if event has reached max supply
    if (event.maxSupply && event.totalClaimed >= event.maxSupply) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event sold out',
          message: 'This event has reached its maximum supply'
        },
        { status: 410 }
      );
    }

    // Check claim time restrictions (backward compatible)
    const now = new Date();
    
    // If claimStartTime is set, check if claiming has started
    if (event.claimStartTime && now < new Date(event.claimStartTime)) {
      const startTime = new Date(event.claimStartTime);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Claiming not yet available',
          message: `Claiming opens on ${formatTimeMessage(startTime, userTimeZone)}`
        },
        { status: 423 } // 423 Locked - resource temporarily unavailable
      );
    }

    // If claimEndTime is set, check if claiming has ended
    if (event.claimEndTime && now > new Date(event.claimEndTime)) {
      const endTime = new Date(event.claimEndTime);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Claiming period ended',
          message: `Claiming closed on ${formatTimeMessage(endTime, userTimeZone)}`
        },
        { status: 410 } // 410 Gone - resource no longer available
      );
    }

    // Validate event has contract address for on-chain claiming
    if (!event.contractAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contract not deployed',
          message: 'This event does not have a smart contract deployed yet'
        },
        { status: 400 }
      );
    }

    // Validate signer configuration
    if (!validateSignerConfig()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          message: 'Signature service is not properly configured'
        },
        { status: 500 }
      );
    }

    // Validate RPC configuration for contract interaction
    if (!env.RPC_URL) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'RPC not configured',
          message: 'Blockchain RPC endpoint is not configured'
        },
        { status: 500 }
      );
    }

    // Generate nonce and signature for user to claim on contract
    const nonce = generateNonce();
    const signature = await signMessage(userAddress, nonce);

    // Return signature data for frontend to execute contract call
    return NextResponse.json({
      success: true,
      data: {
        contractAddress: event.contractAddress,
        signature,
        nonce,
        userAddress,
        eventCode: event.eventCode,
        eventName: event.name,
        eventId: event.id,
        eventData: {
          name: event.name,
          description: event.description,
          imageUrl: event.imageUrl,
          eventDate: event.eventDate,
          organizer: event.organizer,
        }
      },
      message: 'Signature generated, please confirm transaction in your wallet',
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to claim ChronoStamp',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's claimed stamps
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('address');

    if (!userAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing user address',
          message: 'User address parameter is required'
        },
        { status: 400 }
      );
    }

    // Query user's claims
    const userClaims = await db.query.claims.findMany({
      where: eq(claims.userAddress, userAddress),
    });

    // Get event details for each claim
    const userStamps: ChronoStamp[] = [];
    
    for (const claim of userClaims) {
      const event = await db.query.events.findFirst({
        where: eq(events.id, claim.eventId),
      });
      
      if (event) {
        userStamps.push({
          id: claim.id,
          tokenId: parseInt(claim.tokenId ?? '0'),
          eventName: event.name,
          description: event.description,
          imageUrl: event.imageUrl,
          contractAddress: event.contractAddress ?? undefined,
          claimedAt: new Date(claim.claimedAt),
          eventDate: new Date(event.eventDate),
          organizer: event.organizer,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: userStamps,
      total: userStamps.length,
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user stamps',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}