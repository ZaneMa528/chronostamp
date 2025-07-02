import { NextResponse } from 'next/server';
import { mockEvents } from '~/lib/mockData';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Find event by ID
    const event = mockEvents.find(e => e.id === id);
    
    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found',
          message: `No event found with ID: ${id}`
        },
        { status: 404 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Add some additional details for single event view
    const eventDetails = {
      ...event,
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
      }
    };

    return NextResponse.json({
      success: true,
      data: eventDetails,
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch event details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}