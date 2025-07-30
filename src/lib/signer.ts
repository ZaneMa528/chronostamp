import { ethers } from 'ethers';
import { env } from '~/env';

/**
 * Smart Signer Manager - Automatically selects appropriate signing key based on environment
 */
class SignerManager {
  private static instance: SignerManager;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  static getInstance(): SignerManager {
    if (!SignerManager.instance) {
      SignerManager.instance = new SignerManager();
    }
    return SignerManager.instance;
  }
  
  /**
   * Get signer wallet for current environment
   */
  getSigner(): ethers.Wallet {
    const isProduction = env.NODE_ENV === 'production';
    const privateKey = isProduction 
      ? env.SIGNER_PRIVATE_KEY_PROD
      : env.SIGNER_PRIVATE_KEY_DEV;
    
    return new ethers.Wallet(privateKey);
  }
  
  /**
   * Get signer address for current environment
   */
  getSignerAddress(): string {
    const isProduction = env.NODE_ENV === 'production';
    return isProduction 
      ? process.env.NEXT_PUBLIC_SIGNER_ADDRESS_PROD!
      : process.env.NEXT_PUBLIC_SIGNER_ADDRESS_DEV!;
  }
  
  /**
   * Validate signer configuration is correct
   */
  validateSignerConfig(): boolean {
    try {
      const signer = this.getSigner();
      const expectedAddress = this.getSignerAddress();
      const actualAddress = signer.address;
      
      if (actualAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
        console.error(`Signer address mismatch: expected ${expectedAddress}, got ${actualAddress}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Signer validation failed:', error);
      return false;
    }
  }
  
  /**
   * Get current environment information
   */
  getEnvironmentInfo() {
    const isProduction = env.NODE_ENV === 'production';
    return {
      environment: env.NODE_ENV,
      isProduction,
      signerAddress: this.getSignerAddress(),
      timestamp: new Date().toISOString(),
    };
  }
  
  /**
   * Generate signature - Core functionality
   */
  async signMessage(userAddress: string, nonce: string): Promise<string> {
    if (!this.validateSignerConfig()) {
      throw new Error('Signer configuration is invalid');
    }
    
    const signer = this.getSigner();
    
    // Validate address format
    if (!ethers.isAddress(userAddress)) {
      throw new Error(`Invalid address format: ${String(userAddress)}`);
    }
    
    // Ensure address is in checksum format
    const checksumAddress = ethers.getAddress(userAddress);
    
    // Construct message hash (consistent with smart contract)
    // Contract: keccak256(abi.encodePacked(msg.sender, nonce))
    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'bytes32'],
      [checksumAddress, nonce]
    );
    
    // Sign the message hash - ethers.signMessage will add Ethereum prefix automatically
    // Contract will recreate the same messageHash and add the same prefix for verification
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    
    return signature;
  }
  
  /**
   * Generate random nonce
   */
  generateNonce(): string {
    return ethers.hexlify(ethers.randomBytes(32));
  }
}

// Export singleton instance
export const signerManager = SignerManager.getInstance();

// Convenience function exports
export const getSigner = () => signerManager.getSigner();
export const getSignerAddress = () => signerManager.getSignerAddress();
export const signMessage = (userAddress: string, nonce: string) => 
  signerManager.signMessage(userAddress, nonce);
export const generateNonce = () => signerManager.generateNonce();
export const validateSignerConfig = () => signerManager.validateSignerConfig();
export const getEnvironmentInfo = () => signerManager.getEnvironmentInfo();