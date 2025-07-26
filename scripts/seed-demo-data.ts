import { db } from '../src/server/db/index.js'
import { events } from '../src/server/db/schema.js'

async function seedDemoData() {
  console.log('🌱 Seeding demo data...')
  
  // Check if demo data already exists
  const existingEvents = await db.query.events.findMany()
  
  if (existingEvents.length >= 3) {
    console.log('✅ Demo data already exists!')
    existingEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name} (${event.eventCode})`)
    })
    return
  }
  
  // Create demo events (matching original mock data)
  const demoEvents = [
    {
      id: 'demo_event_1',
      name: 'DevConf 2024',
      description: 'The premier developer conference featuring cutting-edge technologies, expert speakers, and networking opportunities for developers worldwide.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
      contractAddress: null, // Will be set when deployed
      eventCode: 'DEVCONF2024',
      organizer: '0x1234567890123456789012345678901234567890',
      eventDate: new Date('2024-03-15'),
      totalClaimed: 142,
      maxSupply: 500,
    },
    {
      id: 'demo_event_2',
      name: 'Web3 Summit',
      description: 'Exploring the future of decentralized web, blockchain technologies, and the evolution of digital ownership and privacy.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop',
      contractAddress: null,
      eventCode: 'WEB3SUMMIT',
      organizer: '0x2345678901234567890123456789012345678901',
      eventDate: new Date('2024-04-10'),
      totalClaimed: 89,
      maxSupply: 300,
    },
    {
      id: 'demo_event_3',
      name: 'AI Workshop',
      description: 'Hands-on machine learning workshop covering neural networks, deep learning frameworks, and practical AI implementation strategies.',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=500&fit=crop',
      contractAddress: null,
      eventCode: 'AIWORKSHOP',
      organizer: '0x3456789012345678901234567890123456789012',
      eventDate: new Date('2024-05-20'),
      totalClaimed: 67,
      maxSupply: 200,
    }
  ]
  
  // Insert demo events
  for (const event of demoEvents) {
    await db.insert(events).values(event)
    console.log(`✅ Created: ${event.name}`)
  }
  
  console.log('🎉 Demo data seeded successfully!')
  process.exit(0)
}

seedDemoData().catch(console.error)