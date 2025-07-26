import { describe, it, expect } from 'vitest'
import { db } from '~/server/db'
import { events, claims } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { signMessage, generateNonce, validateSignerConfig } from '~/lib/signer'
import { createTestEvent, createTestClaim, TEST_USER_ADDRESS } from '../setup'

describe('Database Integration Tests', () => {
  describe('Events Operations', () => {
    it('should create and retrieve events from database', async () => {
      const eventId = await createTestEvent({
        name: 'Integration Test Event',
        description: 'Event for integration testing',
        eventCode: 'INTEGRATION2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      // Retrieve the created event
      const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      })

      expect(event).toBeDefined()
      expect(event!.name).toBe('Integration Test Event')
      expect(event!.eventCode).toBe('INTEGRATION2024')
      expect(event!.totalClaimed).toBe(0)
    })

    it('should find events by event code', async () => {
      await createTestEvent({
        name: 'Event Code Test',
        description: 'Testing event code lookup',
        eventCode: 'LOOKUP2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      const event = await db.query.events.findFirst({
        where: eq(events.eventCode, 'LOOKUP2024'),
      })

      expect(event).toBeDefined()
      expect(event!.eventCode).toBe('LOOKUP2024')
    })

    it('should update event claimed count', async () => {
      const eventId = await createTestEvent({
        name: 'Update Test Event',
        description: 'Testing update operations',
        eventCode: 'UPDATE2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      // Update claimed count
      await db.update(events)
        .set({ totalClaimed: 5 })
        .where(eq(events.id, eventId))

      // Verify update
      const updatedEvent = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      })

      expect(updatedEvent!.totalClaimed).toBe(5)
    })
  })

  describe('Claims Operations', () => {
    it('should create and retrieve claims', async () => {
      const eventId = await createTestEvent({
        name: 'Claim Test Event',
        description: 'Event for claim testing',
        eventCode: 'CLAIMTEST2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      const userAddress = TEST_USER_ADDRESS
      
      await createTestClaim(eventId, userAddress)

      // Retrieve the claim
      const claim = await db.query.claims.findFirst({
        where: and(
          eq(claims.userAddress, userAddress),
          eq(claims.eventId, eventId)
        ),
      })

      expect(claim).toBeDefined()
      expect(claim!.userAddress).toBe(userAddress)
      expect(claim!.eventId).toBe(eventId)
    })

    it('should prevent duplicate claims (logic test)', async () => {
      const eventId = await createTestEvent({
        name: 'Duplicate Test Event',
        description: 'Testing duplicate claim prevention',
        eventCode: 'DUPLICATE2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      const userAddress = '0x2222222222222222222222222222222222222222'
      
      // Create first claim
      await createTestClaim(eventId, userAddress)

      // Check for existing claim (this is what API would do)
      const existingClaim = await db.query.claims.findFirst({
        where: and(
          eq(claims.userAddress, userAddress),
          eq(claims.eventId, eventId)
        ),
      })

      expect(existingClaim).toBeDefined()
      
      // This would prevent duplicate in API logic
      const canClaim = !existingClaim
      expect(canClaim).toBe(false)
    })

    it('should retrieve all claims for a user', async () => {
      const userAddress = '0x3333333333333333333333333333333333333333'
      
      // Create multiple events and claims
      const eventIds = []
      for (let i = 1; i <= 3; i++) {
        const eventId = await createTestEvent({
          name: `Multi Event ${i}`,
          description: `Event ${i} description`,
          eventCode: `MULTI${i}`,
          organizer: '0x1234567890123456789012345678901234567890',
        })
        eventIds.push(eventId)
        await createTestClaim(eventId, userAddress)
      }

      // Retrieve all user claims
      const userClaims = await db.query.claims.findMany({
        where: eq(claims.userAddress, userAddress),
      })

      expect(userClaims).toHaveLength(3)
      expect(userClaims.every(claim => claim.userAddress === userAddress)).toBe(true)
    })
  })

  describe('Signature Generation Integration', () => {
    it('should generate valid signatures', async () => {
      expect(validateSignerConfig()).toBe(true)

      const userAddress = '0x1234567890123456789012345678901234567890'
      const nonce = generateNonce()
      
      const signature = await signMessage(userAddress, nonce)
      
      expect(signature).toBeDefined()
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/) // 65 bytes hex
    })

    it('should work with event codes from database', async () => {
      const eventId = await createTestEvent({
        name: 'Signature Integration Test',
        description: 'Testing signature with real event',
        eventCode: 'SIGINTEGRATION2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      // Verify event exists (API would do this check)
      const event = await db.query.events.findFirst({
        where: eq(events.eventCode, 'SIGINTEGRATION2024'),
      })

      expect(event).toBeDefined()

      // Generate signature (API flow)
      const userAddress = TEST_USER_ADDRESS
      const nonce = generateNonce()
      const signature = await signMessage(userAddress, nonce)

      expect(signature).toBeDefined()
      expect(event!.id).toBe(eventId)
    })
  })

  describe('Full Claim Flow Integration', () => {
    it('should simulate complete claim process', async () => {
      // 1. Create event
      const eventId = await createTestEvent({
        name: 'Full Flow Test',
        description: 'Testing complete claim flow',
        eventCode: 'FULLFLOW2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      const userAddress = TEST_USER_ADDRESS

      // 2. Check event exists (API: GET /api/get-signature validation)
      const event = await db.query.events.findFirst({
        where: eq(events.eventCode, 'FULLFLOW2024'),
      })
      expect(event).toBeDefined()

      // 3. Check no existing claim (API: POST /api/claim validation)
      const existingClaim = await db.query.claims.findFirst({
        where: and(
          eq(claims.userAddress, userAddress),
          eq(claims.eventId, eventId)
        ),
      })
      expect(existingClaim).toBeUndefined()

      // 4. Generate signature (API: POST /api/get-signature)
      const nonce = generateNonce()
      const signature = await signMessage(userAddress, nonce)
      expect(signature).toBeDefined()

      // 5. Create claim (API: POST /api/claim)
      await db.insert(claims).values({
        userAddress,
        eventId,
        tokenId: '1',
        transactionHash: '0x123abc',
      })

      // 6. Update event count (API: POST /api/claim)
      await db.update(events)
        .set({ totalClaimed: event!.totalClaimed + 1 })
        .where(eq(events.id, eventId))

      // 7. Verify claim was created
      const newClaim = await db.query.claims.findFirst({
        where: and(
          eq(claims.userAddress, userAddress),
          eq(claims.eventId, eventId)
        ),
      })
      expect(newClaim).toBeDefined()

      // 8. Verify event count updated
      const updatedEvent = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      })
      expect(updatedEvent!.totalClaimed).toBe(1)

      // 9. Retrieve user claims (API: GET /api/claim)
      const userClaims = await db.query.claims.findMany({
        where: eq(claims.userAddress, userAddress),
      })
      expect(userClaims).toHaveLength(1)
      expect(userClaims[0]!.tokenId).toBe('1')
    })

    it('should handle max supply limits', async () => {
      const eventId = await createTestEvent({
        name: 'Max Supply Test',
        description: 'Testing max supply constraints',
        eventCode: 'MAXSUPPLY2024',
        organizer: '0x1234567890123456789012345678901234567890',
      })

      // Set event to max supply (simulate sold out)
      await db.update(events)
        .set({ totalClaimed: 100, maxSupply: 100 })
        .where(eq(events.id, eventId))

      const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      })

      // Check max supply constraint (API logic)
      const canClaim = event!.maxSupply === null || event!.totalClaimed < event!.maxSupply
      expect(canClaim).toBe(false) // Should be sold out
    })
  })
})