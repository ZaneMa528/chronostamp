'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userStamps.map((stamp) => (
          <Card key={stamp.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square relative">
              <img 
                src={stamp.imageUrl} 
                alt={stamp.eventName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                #{stamp.tokenId}
              </div>
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                {new Date(stamp.claimedAt).toLocaleDateString()}
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{stamp.eventName}</CardTitle>
              <CardDescription className="line-clamp-2">
                {stamp.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              {/* Event Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Event Date:</span>
                  <span className="font-medium">{new Date(stamp.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Claimed:</span>
                  <span className="font-medium">{new Date(stamp.claimedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Memory Badge */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-900">Memory Collected</div>
                    <div className="text-xs text-purple-600">
                      {Math.floor((Date.now() - new Date(stamp.claimedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="flex justify-between items-center pt-2 border-t text-xs">
                <span className="font-mono text-gray-500">
                  {stamp.contractAddress.slice(0, 6)}...{stamp.contractAddress.slice(-4)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard.writeText(stamp.contractAddress);
                    alert('Contract address copied!');
                  }}
                >
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
    </div>
  );
}