import { afterEach } from 'vitest'
import { db } from '~/server/db'
import { events, claims } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

// Test user address - real address to avoid errors  
export const TEST_USER_ADDRESS = '0x59c937eD5486d9B0bf197A4613E8319FdC67D160'

// Track created test data for cleanup
const createdEventIds: string[] = []
const createdClaimUserAddresses: string[] = []

// Setup test data helpers with cleanup tracking
export const createTestEvent = async (eventData: {
  name: string
  description: string
  eventCode: string
  organizer: string
}) => {
  const eventId = `test_event_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  
  await db.insert(events).values({
    id: eventId,
    name: eventData.name,
    description: eventData.description,
    imageUrl: 'https://test.com/image.jpg',
    contractAddress: null,
    eventCode: eventData.eventCode,
    organizer: eventData.organizer,
    eventDate: new Date('2024-08-15T10:00:00Z'),
    totalClaimed: 0,
    maxSupply: 100,
  })
  
  // Track for cleanup
  createdEventIds.push(eventId)
  
  return eventId
}

export const createTestClaim = async (eventId: string, userAddress: string = TEST_USER_ADDRESS) => {
  await db.insert(claims).values({
    userAddress,
    eventId,
    tokenId: '1',
    transactionHash: `0x${Math.random().toString(16).slice(2, 66)}`,
  })
  
  // Track for cleanup
  if (!createdClaimUserAddresses.includes(userAddress)) {
    createdClaimUserAddresses.push(userAddress)
  }
}

// Cleanup after each test - ONLY delete data created during tests
afterEach(async () => {
  // Delete claims created by test users
  for (const userAddress of createdClaimUserAddresses) {
    await db.delete(claims).where(eq(claims.userAddress, userAddress))
  }
  
  // Delete events created during tests
  for (const eventId of createdEventIds) {
    await db.delete(events).where(eq(events.id, eventId))
  }
  
  // Clear tracking arrays
  createdEventIds.length = 0
  createdClaimUserAddresses.length = 0
})