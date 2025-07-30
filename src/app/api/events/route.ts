import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "~/server/db";
import { events } from "~/server/db/schema";
import type { Event } from "~/stores/useAppStore";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizer = searchParams.get("organizer");

    // Query events from database
    const query = db.query.events.findMany({
      orderBy: [desc(events.createdAt)],
    });

    const dbEvents = await query;

    // Filter events by organizer if specified
    const filteredEvents = organizer
      ? dbEvents.filter(
          (event) => event.organizer.toLowerCase() === organizer.toLowerCase(),
        )
      : dbEvents;

    // Convert database format to frontend format
    const formattedEvents: Event[] = filteredEvents.map((event) => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: formattedEvents,
      total: formattedEvents.length,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch events",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
      imageUrl?: string;
      eventCode?: string;
      organizer?: string;
      eventDate?: string;
      maxSupply?: number;
      metadataIpfsHash?: string;
      contractAddress?: string;
    };
    const {
      name,
      description,
      imageUrl,
      eventCode,
      organizer,
      eventDate,
      maxSupply,
      metadataIpfsHash,
      contractAddress,
    } = body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !eventCode ||
      !organizer ||
      !metadataIpfsHash ||
      !contractAddress
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message:
            "Name, description, eventCode, organizer, metadataIpfsHash, and contractAddress are required",
        },
        { status: 400 },
      );
    }

    // Check if event code already exists
    const existingEvent = await db.query.events.findFirst({
      where: eq(events.eventCode, eventCode.toUpperCase()),
    });

    if (existingEvent) {
      return NextResponse.json(
        {
          success: false,
          error: "Event code already exists",
          message: `Event with code ${eventCode} already exists`,
        },
        { status: 409 },
      );
    }

    // Generate unique event ID
    const eventId = `event_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Create new event in database (contract already deployed by frontend)
    const newEventData = {
      id: eventId,
      name,
      description,
      imageUrl:
        imageUrl ??
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop",
      contractAddress, // Contract address from frontend
      eventCode: eventCode.toUpperCase(),
      organizer,
      eventDate: new Date(eventDate ?? Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
      totalClaimed: 0,
      maxSupply: maxSupply ?? 1000, // Default max supply
    };

    await db.insert(events).values(newEventData);

    // Retrieve the created event to return
    const createdEvent = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!createdEvent) {
      throw new Error("Failed to retrieve created event");
    }

    // Convert to frontend format
    const formattedEvent: Event = {
      id: createdEvent.id,
      name: createdEvent.name,
      description: createdEvent.description,
      imageUrl: createdEvent.imageUrl,
      contractAddress: createdEvent.contractAddress ?? undefined,
      eventCode: createdEvent.eventCode,
      organizer: createdEvent.organizer,
      createdAt: new Date(createdEvent.createdAt),
      eventDate: new Date(createdEvent.eventDate),
      totalClaimed: createdEvent.totalClaimed,
      maxSupply: createdEvent.maxSupply,
    };

    return NextResponse.json({
      success: true,
      data: {
        ...formattedEvent,
        // Add IPFS and blockchain deployment info
        ...(metadataIpfsHash && {
          metadataIpfsHash,
          metadataUrl: `ipfs://${metadataIpfsHash}`,
          metadataGatewayUrl: `https://gateway.pinata.cloud/ipfs/${metadataIpfsHash}`,
        }),
        ...(contractAddress && { contractAddress }),
      },
      message:
        "Event created successfully (contract address provided by frontend)",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create event",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
