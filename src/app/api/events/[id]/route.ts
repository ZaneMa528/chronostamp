import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { events } from '~/server/db/schema';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    // Find event by ID in database
    const event = await db.query.events.findFirst({
      where: eq(events.id, id),
    });

    if (!event) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event not found',
          message: `No event found with ID: ${id}`,
        },
        { status: 404 },
      );
    }

    // Add some additional details for single event view
    const eventDetails = {
      id: event.id,
      name: event.name,
      description: event.description,
      imageUrl: event.imageUrl,
      contractAddress: event.contractAddress ?? undefined,
      eventCode: event.eventCode,
      organizer: event.organizer,
      createdAt: new Date(event.createdAt),
      eventDate: new Date(event.eventDate),
      totalClaimed: event.totalClaimed,
      maxSupply: event.maxSupply,
      stats: {
        totalClaimed: event.totalClaimed,
        maxSupply: event.maxSupply,
        remainingSupply: event.maxSupply ? event.maxSupply - event.totalClaimed : null,
        claimRate: event.maxSupply ? Math.round((event.totalClaimed / event.maxSupply) * 100) : null,
      },
      metadata: {
        blockchain: 'Arbitrum One',
        tokenStandard: 'ERC-721',
        royalty: '5%',
        ipfsHash: `Qm${Math.random().toString(36).substring(2, 15)}`,
      },
    };

    return NextResponse.json({
      success: true,
      data: eventDetails,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch event details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
