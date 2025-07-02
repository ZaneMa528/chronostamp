import { NextResponse } from 'next/server';
import type { ChronoStamp } from '~/stores/useAppStore';

// Mock events data (same as in events API)
const mockEvents = [
  {
    id: '1',
    name: 'DevConf 2024',
    description: 'The premier developer conference featuring cutting-edge technologies, expert speakers, and networking opportunities for developers worldwide.',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    eventCode: 'DEVCONF2024',
    organizer: '0xOrganizer1',
    createdAt: new Date('2024-01-15'),
    eventDate: new Date('2024-03-15'),
    totalClaimed: 142,
    maxSupply: 500,
  },
  {
    id: '2', 
    name: 'Web3 Summit',
    description: 'Exploring the future of decentralized web, blockchain technologies, and the evolution of digital ownership and privacy.',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop',
    contractAddress: '0x2345678901bcdef12345678901bcdef123456789',
    eventCode: 'WEB3SUMMIT',
    organizer: '0xOrganizer2',
    createdAt: new Date('2024-01-20'),
    eventDate: new Date('2024-04-10'),
    totalClaimed: 89,
    maxSupply: 300,
  },
  {
    id: '3',
    name: 'AI Workshop',
    description: 'Hands-on machine learning workshop covering neural networks, deep learning frameworks, and practical AI implementation strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=500&fit=crop',
    contractAddress: '0x3456789012cdef123456789012cdef1234567890',
    eventCode: 'AIWORKSHOP',
    organizer: '0xOrganizer3',
    createdAt: new Date('2024-02-01'),
    eventDate: new Date('2024-05-20'),
    totalClaimed: 67,
    maxSupply: 200,
  },
];

// Mock claimed stamps storage (in real app, this would be in database)
const claimedStamps = new Map<string, ChronoStamp[]>();

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