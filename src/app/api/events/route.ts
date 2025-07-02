import { NextResponse } from 'next/server';
import type { Event } from '~/stores/useAppStore';
import { mockEvents } from '~/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizer = searchParams.get('organizer');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter events by organizer if specified
    const filteredEvents = organizer 
      ? mockEvents.filter(event => event.organizer.toLowerCase() === organizer.toLowerCase())
      : mockEvents;
    
    return NextResponse.json({
      success: true,
      data: filteredEvents,
      total: filteredEvents.length,
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