'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '~/components/ui/Button';
import { StampCard } from '~/components/ui/StampCard';
import { ApiClient } from '~/lib/api';
import type { ChronoStamp } from '~/stores/useAppStore';

interface MyStampsTabProps {
  userAddress: string;
}

export function MyStampsTab({ userAddress }: MyStampsTabProps) {
  const [userStamps, setUserStamps] = useState<ChronoStamp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadUserStamps = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.getUserStamps(userAddress);
      
      if (response.success && response.data) {
        // Sort by claimedAt date, newest first
        const sortedStamps = response.data.sort((a, b) => 
          new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
        );
        setUserStamps(sortedStamps);
      } else {
        console.error('Failed to load user stamps:', response.error);
      }
    } catch (error) {
      console.error('Error loading user stamps:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    void loadUserStamps();
  }, [loadUserStamps]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading your ChronoStamp collection...</p>
      </div>
    );
  }

  if (userStamps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No ChronoStamps Yet</h3>
        <p className="text-gray-600 mb-6">Start collecting memories by claiming your first ChronoStamp at an event</p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Claim Your First ChronoStamp
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Memory Collection ({userStamps.length})
        </h3>
        <Button 
          onClick={loadUserStamps} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {userStamps.map((stamp) => (
          <StampCard 
            key={stamp.id} 
            stamp={stamp} 
            size="md"
            onCopy={(address) => {
              void navigator.clipboard.writeText(address);
              alert('Contract address copied to clipboard!');
            }}
          />
        ))}
      </div>
      
    </div>
  );
}