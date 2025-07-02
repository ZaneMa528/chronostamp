'use client';

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { useAppStore } from "~/stores/useAppStore";
import { ApiClient } from "~/lib/api";

export function ClaimForm() {
  const [eventCode, setEventCode] = useState('');
  const { user, addOwnedStamp, setLoading, ui } = useAppStore();

  const handleClaim = async () => {
    if (!eventCode.trim()) {
      alert('Please enter an event code');
      return;
    }

    if (!user.isConnected || !user.address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true, 'Finding event and claiming your ChronoStamp...');
      
      const response = await ApiClient.claimStamp(eventCode, user.address);
      
      if (!response.success) {
        throw new Error(response.message ?? response.error ?? 'Failed to claim ChronoStamp');
      }

      if (response.data) {
        // Add the claimed stamp to user's collection
        addOwnedStamp(response.data.stamp);
        alert(`ChronoStamp claimed successfully!\nTransaction: ${response.data.transaction.hash.slice(0, 10)}...`);
      }
      
      setEventCode('');
    } catch (error) {
      alert('Failed to claim ChronoStamp: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Claim Your ChronoStamp</CardTitle>
        <CardDescription>
          Enter your event code to claim your digital memory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700 mb-2">
            Event Code
          </label>
          <Input
            id="eventCode"
            placeholder="e.g., DEMO2024"
            value={eventCode}
            onChange={(e) => setEventCode(e.target.value)}
            disabled={ui.isLoading}
            className="text-center text-lg font-mono tracking-wider"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            Event codes are provided by organizers at events
          </p>
        </div>
        
        <Button 
          onClick={handleClaim}
          disabled={ui.isLoading || !user.isConnected || !eventCode.trim()}
          className="w-full"
          size="lg"
        >
          {ui.isLoading ? ui.loadingMessage : 'Claim My ChronoStamp'}
        </Button>
        
        {!user.isConnected ? (
          <p className="text-sm text-gray-500 text-center">
            👆 Connect your wallet above to claim stamps
          </p>
        ) : !eventCode.trim() ? (
          <p className="text-sm text-gray-400 text-center">
            Enter an event code to continue
          </p>
        ) : (
          <p className="text-sm text-green-600 text-center">
            ✓ Ready to claim your ChronoStamp!
          </p>
        )}
      </CardContent>
    </Card>
  );
}