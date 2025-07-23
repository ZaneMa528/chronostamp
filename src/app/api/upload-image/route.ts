import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { env } from '~/env';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No file provided',
          message: 'Please select an image file to upload'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type',
          message: 'Only JPEG, PNG, GIF, and WebP images are allowed'
        },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File too large',
          message: 'Image must be smaller than 10MB'
        },
        { status: 400 }
      );
    }

    // Prepare form data for Pinata
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);
    
    // Add metadata for better organization
    const metadata = JSON.stringify({
      name: `chronostamp-${Date.now()}-${file.name}`,
      keyvalues: {
        type: 'event-artwork',
        uploaded: new Date().toISOString(),
      }
    });
    pinataFormData.append('pinataMetadata', metadata);

    // Upload to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata upload failed:', errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Upload failed',
          message: 'Failed to upload image to IPFS'
        },
        { status: 500 }
      );
    }

    const pinataResult = await pinataResponse.json() as { IpfsHash: string };
    const ipfsHash = pinataResult.IpfsHash;

    // Log successful upload for verification
    console.log(`✅ Image uploaded to IPFS successfully!`);
    console.log(`📁 IPFS Hash: ${ipfsHash}`);
    console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${ipfsHash}`);

    return NextResponse.json({
      success: true,
      data: {
        ipfsHash,
        ipfsUrl: `ipfs://${ipfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        fileSize: file.size,
        fileName: file.name,
        fileType: file.type,
      },
      message: 'Image uploaded successfully to IPFS',
    });

  } catch (error) {
    console.error('Upload error:', error);
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