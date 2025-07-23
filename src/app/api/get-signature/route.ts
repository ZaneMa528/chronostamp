import { type NextRequest, NextResponse } from 'next/server';
import { signMessage, generateNonce, validateSignerConfig, getEnvironmentInfo } from '~/lib/signer';
import { mockEvents } from '~/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      userAddress?: string;
      eventCode?: string;
      contractAddress?: string;
    };

    const { userAddress, eventCode, contractAddress } = body;

    // Validate required fields
    if (!userAddress || !eventCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'userAddress and eventCode are required'
        },
        { status: 400 }
      );
    }

    // Validate user address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(userAddress)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid address format',
          message: 'userAddress must be a valid Ethereum address'
        },
        { status: 400 }
      );
    }

    // Validate signer configuration
    if (!validateSignerConfig()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Server configuration error',
          message: 'Signature service is not properly configured'
        },
        { status: 500 }
      );
    }

    // Validate if the event code exists
    const event = mockEvents.find(e => 
      e.eventCode.toLowerCase() === eventCode.toLowerCase()
    );

    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid event code',
          message: `Event with code "${eventCode}" not found`
        },
        { status: 404 }
      );
    }

    // Optional: Validate contract address match (if provided)
    if (contractAddress && contractAddress !== event.contractAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Contract address mismatch',
          message: 'Provided contract address does not match event contract'
        },
        { status: 400 }
      );
    }

    // Generate nonce
    const nonce = generateNonce();

    // Generate signature
    const signature = await signMessage(userAddress, nonce);

    // Get environment information (for debugging)
    const envInfo = getEnvironmentInfo();

    return NextResponse.json({
      success: true,
      data: {
        signature,
        nonce,
        userAddress,
        eventCode: event.eventCode,
        contractAddress: event.contractAddress,
        signerAddress: envInfo.signerAddress,
        environment: envInfo.environment,
      },
      message: 'Signature generated successfully',
    });

  } catch (error) {
    console.error('Signature generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Signature generation failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const envInfo = getEnvironmentInfo();
    const isConfigValid = validateSignerConfig();

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        environment: envInfo.environment,
        signerAddress: envInfo.signerAddress,
        configValid: isConfigValid,
        timestamp: envInfo.timestamp,
      },
      message: 'Signature service is running',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}