'use client';

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { useAppStore } from "~/stores/useAppStore";

export function ClaimForm() {
  const [eventCode, setEventCode] = useState('');
  const { user, mockClaimStamp, setLoading, ui } = useAppStore();

  const handleClaim = async () => {
    if (!eventCode.trim()) {
      alert('Please enter an event code');
      return;
    }

    if (!user.isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true, 'Finding event and claiming your ChronoStamp...');
      // Mock contract address lookup - in real app this would be from API/database
      const mockContractAddress = `0x${Math.random().toString(16).slice(2, 42)}`;
      await mockClaimStamp(eventCode, mockContractAddress);
      alert('ChronoStamp claimed successfully!');
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
            placeholder="Enter your event code (e.g., DEMO2024)"
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