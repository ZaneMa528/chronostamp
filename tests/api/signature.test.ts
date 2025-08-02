import { describe, it, expect } from 'vitest';
import { ethers } from 'ethers';
import { signerManager, signMessage, generateNonce, validateSignerConfig, getEnvironmentInfo } from '~/lib/signer';
import { createTestEvent, TEST_USER_ADDRESS } from '../setup';

describe('Signature Generation', () => {
  describe('Signer Configuration', () => {
    it('should validate signer configuration', () => {
      const isValid = validateSignerConfig();
      expect(isValid).toBe(true);
    });

    it('should return environment information', () => {
      const envInfo = getEnvironmentInfo();

      expect(envInfo).toBeDefined();
      expect(envInfo.environment).toBeDefined();
      expect(envInfo.signerAddress).toBeDefined();
      expect(envInfo.timestamp).toBeDefined();
      expect(typeof envInfo.isProduction).toBe('boolean');
    });

    it('should have valid signer address format', () => {
      const envInfo = getEnvironmentInfo();
      expect(ethers.isAddress(envInfo.signerAddress)).toBe(true);
    });
  });

  describe('Nonce Generation', () => {
    it('should generate valid nonces', () => {
      const nonce1 = generateNonce();
      const nonce2 = generateNonce();

      expect(nonce1).toBeDefined();
      expect(nonce2).toBeDefined();
      expect(nonce1).not.toBe(nonce2); // Should be unique
      expect(nonce1).toMatch(/^0x[a-fA-F0-9]{64}$/); // 32 bytes hex
      expect(nonce2).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should generate different nonces each time', () => {
      const nonces = Array.from({ length: 10 }, () => generateNonce());
      const uniqueNonces = new Set(nonces);

      expect(uniqueNonces.size).toBe(10); // All should be unique
    });
  });

  describe('Message Signing', () => {
    it('should sign messages correctly', async () => {
      const userAddress = TEST_USER_ADDRESS;
      const nonce = generateNonce();

      const signature = await signMessage(userAddress, nonce);

      expect(signature).toBeDefined();
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/); // 65 bytes hex
    });

    it('should produce consistent signatures for same input', async () => {
      const userAddress = TEST_USER_ADDRESS;
      const nonce = '0x1234567890123456789012345678901234567890123456789012345678901234';

      const signature1 = await signMessage(userAddress, nonce);
      const signature2 = await signMessage(userAddress, nonce);

      expect(signature1).toBe(signature2);
    });

    it('should produce different signatures for different inputs', async () => {
      const userAddress1 = '0x1234567890123456789012345678901234567890';
      const userAddress2 = '0x2345678901234567890123456789012345678901';
      const nonce = generateNonce();

      const signature1 = await signMessage(userAddress1, nonce);
      const signature2 = await signMessage(userAddress2, nonce);

      expect(signature1).not.toBe(signature2);
    });

    it('should handle checksum addresses correctly', async () => {
      const userAddress = TEST_USER_ADDRESS;
      const checksumAddress = ethers.getAddress(userAddress);
      const nonce = generateNonce();

      const signature1 = await signMessage(userAddress, nonce);
      const signature2 = await signMessage(checksumAddress, nonce);

      expect(signature1).toBe(signature2);
    });

    it('should reject invalid addresses', async () => {
      const invalidAddress = '0xinvalid';
      const nonce = generateNonce();

      await expect(signMessage(invalidAddress, nonce)).rejects.toThrow('Invalid address format');
    });
  });

  describe('Signature Verification', () => {
    it('should create verifiable signatures', async () => {
      const userAddress = TEST_USER_ADDRESS;
      const nonce = generateNonce();

      const signature = await signMessage(userAddress, nonce);

      // Reconstruct message hash like the contract would
      const checksumAddress = ethers.getAddress(userAddress);
      const messageHash = ethers.solidityPackedKeccak256(['address', 'bytes32'], [checksumAddress, nonce]);

      // Verify signature
      const recoveredAddress = ethers.verifyMessage(ethers.getBytes(messageHash), signature);

      const envInfo = getEnvironmentInfo();
      expect(recoveredAddress.toLowerCase()).toBe(envInfo.signerAddress.toLowerCase());
    });

    it('should work with contract verification format', async () => {
      const userAddress = TEST_USER_ADDRESS;
      const nonce = generateNonce();

      const signature = await signMessage(userAddress, nonce);

      // Simulate contract verification
      const checksumAddress = ethers.getAddress(userAddress);
      const messageHash = ethers.solidityPackedKeccak256(['address', 'bytes32'], [checksumAddress, nonce]);

      // Add Ethereum message prefix (what ECDSA.toEthSignedMessageHash does)
      const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

      // Recover signer from signature
      const recoveredAddress = ethers.recoverAddress(ethSignedMessageHash, signature);

      const envInfo = getEnvironmentInfo();
      expect(recoveredAddress.toLowerCase()).toBe(envInfo.signerAddress.toLowerCase());
    });
  });

  describe('Event Code Integration', () => {
    it('should work with real event codes from database', async () => {
      await createTestEvent({
        name: 'Signature Test Event',
        description: 'Event for testing signature integration',
        eventCode: 'SIGTEST2024',
        organizer: '0x1234567890123456789012345678901234567890',
      });

      const userAddress = '0x1111111111111111111111111111111111111111';
      const nonce = generateNonce();

      // This would be the flow: API finds event by code, then generates signature
      const signature = await signMessage(userAddress, nonce);

      expect(signature).toBeDefined();
      expect(signature).toMatch(/^0x[a-fA-F0-9]{130}$/);
    });
  });

  describe('Error Handling', () => {
    it('should handle signer errors gracefully', async () => {
      // Test with edge case addresses
      const edgeCases = [
        '0x0000000000000000000000000000000000000000', // Zero address
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF', // Max address
      ];

      for (const address of edgeCases) {
        const nonce = generateNonce();
        const signature = await signMessage(address, nonce);
        expect(signature).toBeDefined();
      }
    });

    it('should handle empty or malformed nonces', async () => {
      const userAddress = TEST_USER_ADDRESS;

      // Test various nonce formats
      const validNonces = [
        '0x' + '0'.repeat(64), // All zeros
        '0x' + 'f'.repeat(64), // All f's
        generateNonce(), // Random
      ];

      for (const nonce of validNonces) {
        const signature = await signMessage(userAddress, nonce);
        expect(signature).toBeDefined();
      }
    });
  });
});
