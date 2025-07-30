import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '~/server/db';
import { events, claims } from '~/server/db/schema';
import type { ChronoStamp } from '~/stores/useAppStore';
import { env } from '~/env';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { 
      eventId?: string; 
      userAddress?: string;
      transactionHash?: string;
      tokenId?: string;
      blockNumber?: number;
      gasUsed?: number;
    };
    
    const { eventId, userAddress, transactionHash, tokenId, blockNumber, gasUsed } = body;

    // Validate required fields
    if (!eventId || !userAddress || !transactionHash || !tokenId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'eventId, userAddress, transactionHash, and tokenId are required'
        },
        { status: 400 }
      );
    }

    // Find the event
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found',
          message: `No event found with id: ${eventId}`
        },
        { status: 404 }
      );
    }

    // Check if claim already exists (prevent double recording)
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
          error: 'Already recorded',
          message: 'This claim has already been recorded'
        },
        { status: 409 }
      );
    }

    // Verify transaction on blockchain (optional but recommended)
    if (env.RPC_URL) {
      try {
        const { ethers } = await import('ethers');
        const provider = new ethers.JsonRpcProvider(env.RPC_URL);
        
        // Get transaction receipt to verify it exists and was successful
        const receipt = await provider.getTransactionReceipt(transactionHash);
        
        if (!receipt) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Transaction not found',
              message: 'Transaction not found on blockchain'
            },
            { status: 400 }
          );
        }
        
        if (receipt.status !== 1) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Transaction failed',
              message: 'Transaction failed on blockchain'
            },
            { status: 400 }
          );
        }
        
        // Verify the transaction was to the correct contract
        if (receipt.to?.toLowerCase() !== event.contractAddress?.toLowerCase()) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Wrong contract',
              message: 'Transaction was not sent to the event contract'
            },
            { status: 400 }
          );
        }
        
      } catch (verificationError) {
        console.error('Transaction verification failed:', verificationError);
        // Continue anyway - verification is optional
      }
    }

    // Create new claim record in database
    await db.insert(claims).values({
      userAddress,
      eventId: event.id,
      tokenId: tokenId.toString(),
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
          blockNumber: blockNumber ?? 0,
          gasUsed: gasUsed ?? 0,
        }
      },
      message: 'ChronoStamp claim recorded successfully!',
    });

  } catch (error) {
    console.error('Claim recording error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record claim',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}