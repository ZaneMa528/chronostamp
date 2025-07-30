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
    } = body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !eventCode ||
      !organizer ||
      !metadataIpfsHash
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message:
            "Name, description, eventCode, organizer, and metadataIpfsHash are required",
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

    // Smart contract deployment with IPFS metadata (permanent & decentralized)
    let contractAddress = null;
    let deployTxHash = null;
    let blockNumber = null;

    // Check if contract deployment is configured
    const isContractConfigured = process.env.FACTORY_CONTRACT_ADDRESS && process.env.RPC_URL;

    if (isContractConfigured && metadataIpfsHash) {
      try {
        // 1. Use IPFS hash from frontend as baseTokenURI
        const baseTokenURI = `ipfs://${metadataIpfsHash}`;

        // 2. Deploy contract with IPFS baseTokenURI
        const { ethers } = await import("ethers");
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const deployPrivateKey =
          process.env.NODE_ENV === "production"
            ? process.env.SIGNER_PRIVATE_KEY_PROD!
            : process.env.SIGNER_PRIVATE_KEY_DEV!;
        const wallet = new ethers.Wallet(deployPrivateKey, provider);

        const trustedSigner =
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_SIGNER_ADDRESS_PROD!
            : process.env.NEXT_PUBLIC_SIGNER_ADDRESS_DEV!;

        const factoryContract = new ethers.Contract(
          process.env.FACTORY_CONTRACT_ADDRESS!,
          [
            "function createNewBadge(string memory name, string memory symbol, string memory baseTokenURI, address trustedSigner) external returns (address)",
          ],
          wallet,
        ) as unknown as {
          createNewBadge: (
            name: string,
            symbol: string,
            baseTokenURI: string,
            trustedSigner: string,
          ) => Promise<{
            hash: string;
            wait: () => Promise<{
              contractAddress?: string;
              logs: Array<{ address: string }>;
              blockNumber: number;
            }>;
          }>;
        };

        const tx = await factoryContract.createNewBadge(
          "ChronoStamp Badge", // name
          "CSB", // symbol
          baseTokenURI,
          trustedSigner,
        );
        const receipt = await tx.wait();

        contractAddress =
          receipt.contractAddress ?? receipt.logs[0]?.address ?? null;
        deployTxHash = tx.hash;
        blockNumber = receipt.blockNumber;

        console.log(`✅ Contract deployed: ${contractAddress}`);
        console.log(`📄 IPFS Metadata: ipfs://${metadataIpfsHash}`);
      } catch (contractError) {
        console.error("Contract deployment failed:", contractError);
        
        // Provide specific error messages based on error type
        let errorMessage = "Contract deployment failed";
        let statusCode = 500; // Default to server error
        
        if (contractError instanceof Error) {
          if (contractError.message.includes("insufficient funds")) {
            errorMessage = "Insufficient funds for contract deployment. Please ensure the deployer address has enough ETH for gas fees.";
            statusCode = 400; // Client error - user needs to add funds
          } else if (contractError.message.includes("execution reverted")) {
            errorMessage = "Contract deployment was reverted. Please check contract permissions and parameters.";
            statusCode = 400; // Client error - configuration issue
          } else if (contractError.message.includes("network") || contractError.message.includes("timeout")) {
            errorMessage = "Network error during contract deployment. Please try again.";
            statusCode = 503; // Service unavailable
          } else {
            errorMessage = `Contract deployment failed: ${contractError.message}`;
            statusCode = 500; // Server error for unknown issues
          }
        }

        return NextResponse.json(
          {
            success: false,
            error: "Contract deployment failed",
            message: errorMessage,
          },
          { status: statusCode },
        );
      }
    } else if (isContractConfigured && !metadataIpfsHash) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing IPFS metadata",
          message: "IPFS metadata hash is required for contract deployment",
        },
        { status: 400 },
      );
    }

    // Create new event in database
    const newEventData = {
      id: eventId,
      name,
      description,
      imageUrl:
        imageUrl ??
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop",
      contractAddress, // Real contract address (null if deployment failed)
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
        ...(deployTxHash && { deployTxHash }),
        ...(blockNumber && { blockNumber }),
      },
      message: contractAddress
        ? "Event and contract created successfully with IPFS metadata"
        : isContractConfigured 
          ? "Event created successfully (contract deployment was not attempted due to missing metadata)"
          : "Event created successfully (contract deployment not configured)",
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
