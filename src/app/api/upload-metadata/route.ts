import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { env } from '~/env';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      name?: string;
      description?: string;
      imageUrl?: string;
      eventDate?: string;
      organizer?: string;
      eventCode?: string;
    };

    const { name, description, imageUrl, eventDate, organizer, eventCode } = body;

    // Validate required fields
    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Name, description, and imageUrl are required'
        },
        { status: 400 }
      );
    }

    // Validate image URL format (should be IPFS URL)
    if (!imageUrl.startsWith('ipfs://')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid image URL',
          message: 'Image URL must be an IPFS URL (ipfs://...)'
        },
        { status: 400 }
      );
    }

    // Construct NFT metadata following OpenSea standard
    const metadata: NFTMetadata = {
      name,
      description,
      image: imageUrl,
      attributes: [
        {
          trait_type: "Event Type",
          value: "ChronoStamp"
        },
        {
          trait_type: "Event Code",
          value: eventCode ?? "Unknown"
        },
        {
          trait_type: "Organizer",
          value: organizer ?? "Anonymous"
        }
      ]
    };

    // Add event date if provided
    if (eventDate) {
      const dateValue = new Date(eventDate).toISOString().split('T')[0];
      metadata.attributes?.push({
        trait_type: "Event Date",
        value: dateValue ?? "Unknown" // YYYY-MM-DD format
      });
    }

    // Upload metadata to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `chronostamp-metadata-${Date.now()}`,
          keyvalues: {
            type: 'nft-metadata',
            eventName: name,
            eventCode: eventCode ?? 'unknown',
            uploaded: new Date().toISOString(),
          }
        }
      }),
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata metadata upload failed:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Upload failed',
          message: 'Failed to upload metadata to IPFS'
        },
        { status: 500 }
      );
    }

    const pinataResult = await pinataResponse.json() as { IpfsHash: string };
    const ipfsHash = pinataResult.IpfsHash;

    // Log successful upload for verification
    console.log(`✅ Metadata uploaded to IPFS successfully!`);
    console.log(`📄 IPFS Hash: ${ipfsHash}`);
    console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return NextResponse.json({
      success: true,
      data: {
        ipfsHash,
        ipfsUrl: `ipfs://${ipfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        metadata,
      },
      message: 'Metadata uploaded successfully to IPFS',
    });

  } catch (error) {
    console.error('Metadata upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}