/**
 * Unified claim logic for ChronoStamp NFTs
 * Handles the complete Web3 claim flow with consistent error handling
 */

import { ApiClient } from '~/lib/api';
import { callClaimContract, checkWalletConnection } from '~/lib/web3-utils';
import type { ChronoStamp } from '~/stores/useAppStore';

export interface ClaimOptions {
  eventCode: string;
  userAddress: string;
  onStatusChange?: (status: string) => void;
  onSuccess?: (data: { hash: string; tokenId: string; stamp: ChronoStamp }) => void;
  onError?: (error: string) => void;
  onWarning?: (warning: string) => void;
}

export interface ClaimResult {
  success: boolean;
  hash?: string;
  tokenId?: string;
  stamp?: ChronoStamp;
  error?: string;
}

/**
 * Execute the complete Web3 claim flow
 * Returns claim result with transaction details
 */
export async function executeClaim(options: ClaimOptions): Promise<ClaimResult> {
  const { eventCode, userAddress, onStatusChange, onSuccess, onError, onWarning } = options;

  try {
    // Step 1: Get signature from server
    onStatusChange?.('Preparing claim signature...');
    
    // Get user's timezone for localized error messages
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const signatureResponse = await ApiClient.getClaimSignature(eventCode, userAddress, userTimeZone);
    
    if (!signatureResponse.success || !signatureResponse.data) {
      const errorMsg = signatureResponse.message ?? signatureResponse.error ?? 'Failed to get claim signature';
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Step 2: Verify wallet connection and address
    onStatusChange?.('Verifying wallet connection...');
    const walletStatus = await checkWalletConnection();
    
    if (!walletStatus.isConnected || walletStatus.address?.toLowerCase() !== userAddress.toLowerCase()) {
      const errorMsg = 'Wallet connection lost or address mismatch';
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Step 3: Call smart contract
    onStatusChange?.('Calling smart contract...');
    
    const txResult = await callClaimContract(signatureResponse.data);
    
    // Step 4: Record successful transaction
    onStatusChange?.('Recording claim transaction...');
    
    const recordResponse = await ApiClient.recordClaim(
      signatureResponse.data.eventId,
      userAddress,
      txResult.hash,
      txResult.tokenId,
      txResult.blockNumber,
      txResult.gasUsed
    );
    
    if (!recordResponse.success || !recordResponse.data) {
      // Transaction succeeded but recording failed - show warning
      const warningMsg = 'Transaction succeeded but failed to record. Your NFT is minted on blockchain.';
      onWarning?.(warningMsg);
      console.error('Failed to record claim:', recordResponse.error);
      
      // Still return success since blockchain transaction succeeded
      return {
        success: true,
        hash: txResult.hash,
        tokenId: txResult.tokenId,
        error: 'Recording failed but NFT minted successfully'
      };
    }

    // Complete success
    const result = {
      success: true,
      hash: txResult.hash,
      tokenId: txResult.tokenId,
      stamp: recordResponse.data.stamp
    };

    onSuccess?.(result);
    return result;
    
  } catch (error) {
    const errorMessage = (error as Error).message;
    let userFriendlyError: string;
    
    // Handle specific Web3 errors with user-friendly messages
    if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
      userFriendlyError = 'Transaction was cancelled by user';
    } else if (errorMessage.includes('insufficient funds')) {
      userFriendlyError = 'Insufficient funds for gas fees. Please add ETH to your wallet.';
    } else if (errorMessage.includes('already been processed')) {
      userFriendlyError = 'You have already claimed this ChronoStamp';
    } else if (errorMessage.includes('Claiming not yet available')) {
      userFriendlyError = errorMessage; // Use server message directly
    } else if (errorMessage.includes('Claiming period ended')) {
      userFriendlyError = errorMessage; // Use server message directly
    } else if (errorMessage.includes('Contract not deployed')) {
      userFriendlyError = 'This event is not yet available for claiming';
    } else {
      userFriendlyError = 'Failed to claim ChronoStamp: ' + errorMessage;
    }
    
    onError?.(userFriendlyError);
    return { success: false, error: userFriendlyError };
  }
}

/**
 * Get Arbitrum Sepolia block explorer URL for transaction
 */
export function getTransactionUrl(hash: string): string {
  return `https://sepolia.arbiscan.io/tx/${hash}`;
}