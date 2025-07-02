import { NextResponse } from 'next/server';
import type { Event } from '~/stores/useAppStore';

// Mock events data
const mockEvents: Event[] = [
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

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      data: mockEvents,
      total: mockEvents.length,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch events',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      name?: string;
      description?: string;
      imageUrl?: string;
      eventCode?: string;
      organizer?: string;
      eventDate?: string;
      maxSupply?: number;
    };
    const { name, description, imageUrl, eventCode, organizer, eventDate, maxSupply } = body;

    // Validate required fields
    if (!name || !description || !eventCode || !organizer) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Name, description, eventCode, and organizer are required'
        },
        { status: 400 }
      );
    }

    // Check if event code already exists
    if (mockEvents.some(event => event.eventCode === eventCode?.toUpperCase())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event code already exists',
          message: `Event with code ${eventCode} already exists`
        },
        { status: 409 }
      );
    }

    // Create new event
    const newEvent: Event = {
      id: (mockEvents.length + 1).toString(),
      name,
      description,
      imageUrl: imageUrl ?? 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
      contractAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
      eventCode: eventCode.toUpperCase(),
      organizer,
      createdAt: new Date(),
      eventDate: new Date(eventDate ?? Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      totalClaimed: 0,
      maxSupply: maxSupply ?? undefined,
    };

    // Add to mock data (in a real app, this would be saved to database)
    mockEvents.push(newEvent);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Event created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create event',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}