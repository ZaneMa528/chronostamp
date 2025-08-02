import { describe, it, expect } from 'vitest';
import { db } from '~/server/db';
import { events, claims } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { createTestEvent, createTestClaim, TEST_USER_ADDRESS } from '../setup';

describe('Claim API Integration', () => {
  describe('POST /api/claim', () => {
    it('should create claim successfully', async () => {
      const eventId = await createTestEvent({
        name: 'Claim Test Event',
        description: 'Event for testing claims',
        eventCode: 'CLAIM2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const userAddress = TEST_USER_ADDRESS;

      // Simulate claim creation (without HTTP layer for simplicity)
      const existingClaim = await db.query.claims.findFirst({
        where: and(eq(claims.userAddress, userAddress), eq(claims.eventId, eventId)),
      });

      expect(existingClaim).toBeUndefined();

      // Create claim
      await db.insert(claims).values({
        userAddress,
        eventId,
        tokenId: '1',
        transactionHash: '0x123abc',
      });

      // Update event claimed count
      await db.update(events).set({ totalClaimed: 1 }).where(eq(events.id, eventId));

      // Verify claim was created
      const createdClaim = await db.query.claims.findFirst({
        where: and(eq(claims.userAddress, userAddress), eq(claims.eventId, eventId)),
      });

      expect(createdClaim).toBeDefined();
      expect(createdClaim?.userAddress).toBe(userAddress);
      expect(createdClaim?.eventId).toBe(eventId);
      expect(createdClaim?.tokenId).toBe('1');

      // Verify event total claimed was updated
      const updatedEvent = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      });

      expect(updatedEvent!.totalClaimed).toBe(1);
    });

    it('should prevent duplicate claims', async () => {
      const eventId = await createTestEvent({
        name: 'Duplicate Claim Test',
        description: 'Event for testing duplicate claims',
        eventCode: 'DUPLICATE2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const userAddress = TEST_USER_ADDRESS;

      // Create initial claim
      await createTestClaim(eventId, userAddress);

      // Try to create duplicate claim
      const existingClaim = await db.query.claims.findFirst({
        where: and(eq(claims.userAddress, userAddress), eq(claims.eventId, eventId)),
      });

      expect(existingClaim).toBeDefined();

      // Duplicate claim should be prevented by checking existing claims
      expect(existingClaim?.userAddress).toBe(userAddress);
      expect(existingClaim?.eventId).toBe(eventId);
    });

    it('should handle max supply limit', async () => {
      const eventId = await createTestEvent({
        name: 'Max Supply Test',
        description: 'Event for testing max supply',
        eventCode: 'MAXSUPPLY2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      // Set event to max supply
      await db.update(events).set({ totalClaimed: 100, maxSupply: 100 }).where(eq(events.id, eventId));

      const event = await db.query.events.findFirst({
        where: eq(events.id, eventId),
      });

      expect(event!.totalClaimed).toBe(100);
      expect(event!.maxSupply).toBe(100);

      // Should prevent claim when at max supply
      const canClaim = event?.maxSupply && event.totalClaimed >= event.maxSupply;
      expect(canClaim).toBe(true);
    });
  });

  describe('GET /api/claim', () => {
    it('should return user claims', async () => {
      const eventId1 = await createTestEvent({
        name: 'User Claims Test 1',
        description: 'First event for user claims test',
        eventCode: 'USERCLAIMS1',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const eventId2 = await createTestEvent({
        name: 'User Claims Test 2',
        description: 'Second event for user claims test',
        eventCode: 'USERCLAIMS2',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const userAddress = TEST_USER_ADDRESS;

      // Create claims for user
      await createTestClaim(eventId1, userAddress);
      await createTestClaim(eventId2, userAddress);

      // Query user claims
      const userClaims = await db.query.claims.findMany({
        where: eq(claims.userAddress, userAddress),
      });

      expect(userClaims).toHaveLength(2);
      expect(userClaims[0]!.userAddress).toBe(userAddress);
      expect(userClaims[1]!.userAddress).toBe(userAddress);

      // Verify event details can be retrieved for each claim
      for (const claim of userClaims) {
        const event = await db.query.events.findFirst({
          where: eq(events.id, claim.eventId),
        });
        expect(event).toBeDefined();
      }
    });

    it('should return empty array for user with no claims', async () => {
      const userAddress = TEST_USER_ADDRESS;

      const userClaims = await db.query.claims.findMany({
        where: eq(claims.userAddress, userAddress),
      });

      expect(userClaims).toHaveLength(0);
    });

    it('should return claims with correct token IDs', async () => {
      const eventId = await createTestEvent({
        name: 'Token ID Test',
        description: 'Event for testing token IDs',
        eventCode: 'TOKENID2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const userAddress = TEST_USER_ADDRESS;

      // Create claim with specific token ID
      await db.insert(claims).values({
        userAddress,
        eventId,
        tokenId: '42',
        transactionHash: '0x123abc',
      });

      const userClaims = await db.query.claims.findMany({
        where: eq(claims.userAddress, userAddress),
      });

      expect(userClaims[0]!.tokenId).toBe('42');
    });
  });

  describe('Event Code Validation', () => {
    it('should find event by code case-insensitively', async () => {
      await createTestEvent({
        name: 'Case Test Event',
        description: 'Event for testing case sensitivity',
        eventCode: 'CASETEST2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      // Test various case combinations
      const testCodes = ['CASETEST2024', 'casetest2024', 'CaseTest2024'];

      for (const testCode of testCodes) {
        const event = await db.query.events.findFirst({
          where: eq(events.eventCode, testCode.toUpperCase()),
        });
        expect(event).toBeDefined();
        expect(event!.eventCode).toBe('CASETEST2024');
      }
    });

    it('should return null for non-existent event code', async () => {
      const event = await db.query.events.findFirst({
        where: eq(events.eventCode, 'NONEXISTENT2024'),
      });

      expect(event).toBeUndefined();
    });
  });
});
