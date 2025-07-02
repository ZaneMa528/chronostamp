import { NextResponse } from 'next/server';
import type { ChronoStamp } from '~/stores/useAppStore';
import { mockEvents, claimedStamps } from '~/lib/mockData';

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
    const event = mockEvents.find(e => e.eventCode.toUpperCase() === eventCode?.toUpperCase());
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
    const userStamps = claimedStamps.get(userAddress) ?? [];
    const alreadyClaimed = userStamps.some(stamp => stamp.eventName === event.name);
    
    if (alreadyClaimed) {
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

    // Create new ChronoStamp
    const newStamp: ChronoStamp = {
      id: Date.now(),
      tokenId: event.totalClaimed + 1,
      eventName: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      contractAddress: event.contractAddress,
      claimedAt: new Date(),
      eventDate: event.eventDate,
      organizer: event.organizer,
    };

    // Add to user's collection
    if (!claimedStamps.has(userAddress)) {
      claimedStamps.set(userAddress, []);
    }
    claimedStamps.get(userAddress)?.push(newStamp);

    // Update event's total claimed count
    event.totalClaimed += 1;

    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      success: true,
      data: {
        stamp: newStamp,
        transaction: {
          hash: `0x${Math.random().toString(16).slice(2, 66)}`,
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          gasUsed: Math.floor(Math.random() * 50000) + 21000,
        }
      },
      message: 'ChronoStamp claimed successfully!',
    });

  } catch (error) {
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

    const userStamps = claimedStamps.get(userAddress) ?? [];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: userStamps,
      total: userStamps.length,
    });

  } catch (error) {
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