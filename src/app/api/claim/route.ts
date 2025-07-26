import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '~/server/db';
import { events, claims } from '~/server/db/schema';
import type { ChronoStamp } from '~/stores/useAppStore';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { eventCode?: string; userAddress?: string };
    const { eventCode, userAddress } = body;

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

    // Generate transaction hash (simulate blockchain transaction)
    const transactionHash = `0x${Math.random().toString(16).slice(2, 66)}`;
    const tokenId = (event.totalClaimed + 1).toString();

    // Create new claim record in database
    await db.insert(claims).values({
      userAddress,
      eventId: event.id,
      tokenId,
      transactionHash,
    });

    // Update event's total claimed count
    await db.update(events)
      .set({ totalClaimed: event.totalClaimed + 1 })
      .where(eq(events.id, event.id));

    // Create ChronoStamp response
    const newStamp: ChronoStamp = {
      id: Date.now(),
      tokenId: parseInt(tokenId),
      eventName: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      contractAddress: event.contractAddress ?? undefined,
      claimedAt: new Date(),
      eventDate: new Date(event.eventDate),
      organizer: event.organizer,
    };

    return NextResponse.json({
      success: true,
      data: {
        stamp: newStamp,
        transaction: {
          hash: transactionHash,
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
        }
      },
      message: 'ChronoStamp claimed successfully!',
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