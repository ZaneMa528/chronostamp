'use client';

import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { useAppStore } from "~/stores/useAppStore";
import { useNotificationStore } from "~/stores/useNotificationStore";
import { executeClaim, getTransactionUrl } from "~/lib/claim-utils";

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

    setLoading(true);

    await executeClaim({
      eventCode: eventCode.trim(),
      userAddress: user.address,
      onStatusChange: (status) => setLoading(true, status),
      onSuccess: (data) => {
        // Add the claimed stamp to user's collection
        if (data.stamp) {
          addOwnedStamp(data.stamp);
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
                window.open(getTransactionUrl(data.hash), '_blank');
              }
            }]
          }
        );
        
        setEventCode('');
      },
      onError: (error) => showError(error),
      onWarning: (warning) => showWarning(warning)
    });

    setLoading(false);
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