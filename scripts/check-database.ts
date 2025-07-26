import { db } from '../src/server/db'
import { events, claims } from '../src/server/db/schema'

async function checkDatabase() {
  console.log('🔍 Checking database content...')
  
  // Check events
  const allEvents = await db.query.events.findMany()
  console.log(`📅 Found ${allEvents.length} events in database:`)
  
  if (allEvents.length === 0) {
    console.log('❌ No demo events found in database!')
    console.log('💡 Need to seed with demo data')
  } else {
    allEvents.forEach((event, index) => {
      console.log(`${index + 1}. ${event.name} (${event.eventCode})`)
      console.log(`   - Total claimed: ${event.totalClaimed}`)
      console.log(`   - Max supply: ${event.maxSupply}`)
      console.log(`   - Contract: ${event.contractAddress || 'Not deployed'}`)
    })
  }
  
  // Check claims
  const allClaims = await db.query.claims.findMany()
  console.log(`\n🎫 Found ${allClaims.length} claims in database`)
  
  if (allClaims.length > 0) {
    console.log('Claims:')
    allClaims.forEach((claim, index) => {
      console.log(`${index + 1}. User: ${claim.userAddress}`)
      console.log(`   - Event ID: ${claim.eventId}`)
      console.log(`   - Token ID: ${claim.tokenId}`)
    })
  }
  
  process.exit(0)
}

checkDatabase().catch(console.error)