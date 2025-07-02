import { NextResponse } from 'next/server';

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