'use client';

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { useAppStore } from "~/stores/useAppStore";
import { useNotificationStore } from "~/stores/useNotificationStore";
import { ApiClient } from "~/lib/api";
import { callClaimContract, checkWalletConnection } from "~/lib/web3-utils";

export function ClaimForm() {
  const [eventCode, setEventCode] = useState('');
  const { user, addOwnedStamp, setLoading, ui } = useAppStore();
  const { showSuccess, showError, showWarning } = useNotificationStore();

  const handleClaim = async () => {
    if (!eventCode.trim()) {
      showWarning('Please enter an event code');
      return;
    }

    if (!user.isConnected || !user.address) {
      showWarning('Please connect your wallet first');
      return;
    }

    try {
      // Step 1: Get signature from server
      setLoading(true, 'Preparing claim signature...');
      
      const signatureResponse = await ApiClient.getClaimSignature(eventCode, user.address);
      
      if (!signatureResponse.success || !signatureResponse.data) {
        throw new Error(signatureResponse.message ?? signatureResponse.error ?? 'Failed to get claim signature');
      }

      // Step 2: Verify wallet connection and address
      setLoading(true, 'Verifying wallet connection...');
      const walletStatus = await checkWalletConnection();
      
      if (!walletStatus.isConnected || walletStatus.address?.toLowerCase() !== user.address.toLowerCase()) {
        throw new Error('Wallet connection lost or address mismatch');
      }

      // Step 3: Call smart contract
      setLoading(true, 'Calling smart contract...');
      
      const txResult = await callClaimContract(signatureResponse.data);
      
      // Step 4: Record successful transaction
      setLoading(true, 'Recording claim transaction...');
      
      const recordResponse = await ApiClient.recordClaim(
        signatureResponse.data.eventId,
        user.address,
        txResult.hash,
        txResult.tokenId,
        txResult.blockNumber,
        txResult.gasUsed
      );
      
      if (!recordResponse.success || !recordResponse.data) {
        // Transaction succeeded but recording failed - show warning
        showWarning('Transaction succeeded but failed to record. Your NFT is minted on blockchain.');
        console.error('Failed to record claim:', recordResponse.error);
      } else {
        // Add the claimed stamp to user's collection
        addOwnedStamp(recordResponse.data.stamp);
      }
      
      // Show success message
      showSuccess(
        `ChronoStamp claimed successfully! 🎉`,
        {
          title: 'Claim Successful',
          duration: 8000,
          actions: [{
            label: 'View Transaction',
            onClick: () => {
              // Use block explorer for Arbitrum Sepolia
              window.open(`https://sepolia.arbiscan.io/tx/${txResult.hash}`, '_blank');
            }
          }]
        }
      );
      
      setEventCode('');
      
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      // Handle specific Web3 errors with user-friendly messages
      if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        showError('Transaction was cancelled by user');
      } else if (errorMessage.includes('insufficient funds')) {
        showError('Insufficient funds for gas fees. Please add ETH to your wallet.');
      } else if (errorMessage.includes('already been processed')) {
        showError('You have already claimed this ChronoStamp');
      } else if (errorMessage.includes('Contract not deployed')) {
        showError('This event is not yet available for claiming');
      } else {
        showError('Failed to claim ChronoStamp: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl md:text-2xl">
          Claim Your ChronoStamp
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your event code to claim your digital memory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="eventCode"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Event Code
          </label>
          <Input
            id="eventCode"
            placeholder="e.g., DEVCONF2025"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            disabled={ui.isLoading}
            className="h-12 text-center font-mono text-base tracking-wider sm:h-14 sm:text-lg"
          />
          <p className="mt-1 text-center text-xs text-gray-500">
            Event codes are provided by organizers at events
          </p>
        </div>

        <Button
          onClick={handleClaim}
          disabled={ui.isLoading || !user.isConnected || !eventCode.trim()}
          className="h-12 w-full text-sm sm:h-14 sm:text-base"
          size="lg"
        >
          {ui.isLoading ? ui.loadingMessage : "Claim My ChronoStamp"}
        </Button>

        {!user.isConnected ? (
          <p className="text-center text-xs text-gray-500 sm:text-sm">
            👆 Connect your wallet above to claim stamps
          </p>
        ) : !eventCode.trim() ? (
          <p className="text-center text-xs text-gray-400 sm:text-sm">
            Enter an event code to continue
          </p>
        ) : (
          <p className="text-center text-xs text-green-600 sm:text-sm">
            ✓ Ready to claim your ChronoStamp!
          </p>
        )}
      </CardContent>
    </Card>
  );
}