import { createClient } from '@libsql/client';

const db = createClient({
  url: 'file:db.sqlite'
});

async function seedData() {
  console.log('🌱 Seeding demo data directly...');
  
  // Check existing data
  const existing = await db.execute('SELECT COUNT(*) as count FROM chronostamp_events');
  const count = existing.rows[0]?.count;
  
  if (count && Number(count) > 0) {
    console.log(`✅ Database already has ${count} events`);
    return;
  }
  
  console.log('📦 Inserting demo events...');
  
  // Insert demo events
  const demoEvents = [
    {
      id: 'demo_event_1',
      name: 'DevConf 2024',
      description: 'The premier developer conference featuring cutting-edge technologies, expert speakers, and networking opportunities for developers worldwide.',
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=500&fit=crop',
      contractAddress: null,
      eventCode: 'DEVCONF2024',
      organizer: '0x1234567890123456789012345678901234567890',
      eventDate: Math.floor(new Date('2024-03-15').getTime() / 1000),
      totalClaimed: 142,
      maxSupply: 500,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: null
    },
    {
      id: 'demo_event_2', 
      name: 'Web3 Summit',
      description: 'Exploring the future of decentralized web, blockchain technologies, and the evolution of digital ownership and privacy.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&h=500&fit=crop',
      contractAddress: null,
      eventCode: 'WEB3SUMMIT',
      organizer: '0x2345678901234567890123456789012345678901',
      eventDate: Math.floor(new Date('2024-04-10').getTime() / 1000),
      totalClaimed: 89,
      maxSupply: 300,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: null
    },
    {
      id: 'demo_event_3',
      name: 'AI Workshop', 
      description: 'Hands-on machine learning workshop covering neural networks, deep learning frameworks, and practical AI implementation strategies.',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=500&fit=crop',
      contractAddress: null,
      eventCode: 'AIWORKSHOP',
      organizer: '0x3456789012345678901234567890123456789012',
      eventDate: Math.floor(new Date('2024-05-20').getTime() / 1000),
      totalClaimed: 67,
      maxSupply: 200,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: null
    }
  ];
  
  for (const event of demoEvents) {
    await db.execute({
      sql: `INSERT INTO chronostamp_events 
            (id, name, description, imageUrl, contractAddress, eventCode, organizer, eventDate, totalClaimed, maxSupply, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        event.id,
        event.name, 
        event.description,
        event.imageUrl,
        event.contractAddress,
        event.eventCode,
        event.organizer,
        event.eventDate,
        event.totalClaimed,
        event.maxSupply,
        event.createdAt,
        event.updatedAt
      ]
    });
    console.log(`✅ Created: ${event.name}`);
  }
  
  // Verify insertion
  const result = await db.execute('SELECT name, eventCode, totalClaimed FROM chronostamp_events');
  console.log('\n🎉 Demo data inserted successfully!');
  console.log('📋 Events in database:');
  result.rows.forEach((row, index) => {
    console.log(`${index + 1}. ${row.name} (${row.eventCode}) - ${row.totalClaimed} claimed`);
  });
  
  console.log('\n✨ Database ready for testing!');
}

seedData().catch(console.error);