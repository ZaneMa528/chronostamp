/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

/**
 * Minimal Web3 utilities for ChronoStamp contract interaction
 * Keeps external dependencies minimal and focuses on core functionality
 */

export interface ClaimSignatureData {
  contractAddress: string;
  signature: string;
  nonce: string;
  userAddress: string;
  eventCode: string;
  eventName: string;
  eventId: string;
  eventData: {
    name: string;
    description: string;
    imageUrl: string;
    eventDate: string;
    organizer: string;
  };
}

export interface ClaimTransactionResult {
  hash: string;
  tokenId: string;
  blockNumber: number;
  gasUsed: number;
}

/**
 * Call the ChronoStamp contract claim function using user's wallet
 */
export async function callClaimContract(signatureData: ClaimSignatureData): Promise<ClaimTransactionResult> {
  // Check if window.ethereum is available
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }

  try {
    // Import ethers dynamically to keep bundle size small
    const { ethers } = await import('ethers');

    // Create provider and signer
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();

    // Verify user address matches
    const userAddress = await signer.getAddress();
    if (userAddress.toLowerCase() !== signatureData.userAddress.toLowerCase()) {
      throw new Error('Wallet address does not match the signature recipient');
    }

    // Create contract interface
    const contractInterface = new ethers.Interface([
      'function claim(bytes memory signature, bytes32 nonce) external',
      'event BadgeClaimed(address indexed recipient, uint256 indexed tokenId)',
    ]);

    // Create contract instance
    const contract = new ethers.Contract(signatureData.contractAddress, contractInterface, signer);

    // Call claim function with proper typing
    const tx = await (contract as any).claim(signatureData.signature, signatureData.nonce);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }

    // Extract transaction details
    const transactionHash = tx.hash;
    const blockNumber = receipt.blockNumber;
    const gasUsed = Number(receipt.gasUsed);

    // Extract tokenId from BadgeClaimed event
    const claimEvent = receipt.logs.find((log: any) => {
      try {
        const parsed = contractInterface.parseLog({
          topics: log.topics,
          data: log.data,
        });
        return parsed?.name === 'BadgeClaimed';
      } catch {
        return false;
      }
    });

    if (!claimEvent) {
      throw new Error('BadgeClaimed event not found in transaction logs');
    }

    // Parse the event to get tokenId
    const parsedEvent = contractInterface.parseLog({
      topics: claimEvent.topics,
      data: claimEvent.data,
    });
    const tokenId = parsedEvent?.args[1]?.toString() ?? '0';

    return {
      hash: transactionHash,
      tokenId,
      blockNumber,
      gasUsed,
    };
  } catch (error: any) {
    // Handle common Web3 errors
    if (error.code === 4001) {
      throw new Error('Transaction was rejected by user');
    }

    if (error.message?.includes('insufficient funds')) {
      throw new Error('Insufficient funds for gas fees');
    }

    if (error.message?.includes('ChronoStamp: Nonce already used')) {
      throw new Error('This claim request has already been processed');
    }

    if (error.message?.includes('ChronoStamp: Invalid signature')) {
      throw new Error('Invalid signature - please try again');
    }

    // Re-throw with original message for other errors
    throw new Error(error.message ?? 'Contract call failed');
  }
}

/**
 * Check if user's wallet is connected and on the correct network
 */
export async function checkWalletConnection(): Promise<{
  isConnected: boolean;
  address?: string;
  chainId?: number;
}> {
  if (!window.ethereum) {
    return { isConnected: false };
  }

  try {
    const { ethers } = await import('ethers');
    const provider = new ethers.BrowserProvider(window.ethereum as any);

    const accounts = await provider.listAccounts();
    if (accounts.length === 0) {
      return { isConnected: false };
    }

    const network = await provider.getNetwork();
    return {
      isConnected: true,
      address: accounts[0]?.address,
      chainId: Number(network.chainId),
    };
  } catch {
    return { isConnected: false };
  }
}

/**
 * Request wallet connection
 */
export async function requestWalletConnection(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or another Web3 wallet');
  }

  try {
    const { ethers } = await import('ethers');
    const provider = new ethers.BrowserProvider(window.ethereum as any);

    // Request account access
    await provider.send('eth_requestAccounts', []);

    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Wallet connection was rejected by user');
    }
    throw new Error(error.message ?? 'Failed to connect wallet');
  }
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
