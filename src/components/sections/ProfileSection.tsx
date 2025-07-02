'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { useAppStore } from '~/stores/useAppStore';
import { ApiClient } from '~/lib/api';
import type { ChronoStamp } from '~/stores/useAppStore';

export function ProfileSection() {
  const { user } = useAppStore();
  const [userStamps, setUserStamps] = useState<ChronoStamp[]>([]);
  const [isLoadingStamps, setIsLoadingStamps] = useState(false);

  const loadUserStamps = useCallback(async () => {
    if (!user.address) return;

    try {
      setIsLoadingStamps(true);
      const response = await ApiClient.getUserStamps(user.address);
      
      if (response.success && response.data) {
        setUserStamps(response.data);
      } else {
        console.error('Failed to load user stamps:', response.error);
      }
    } catch (error) {
      console.error('Error loading user stamps:', error);
    } finally {
      setIsLoadingStamps(false);
    }
  }, [user.address]);

  useEffect(() => {
    if (user.isConnected && user.address) {
      void loadUserStamps();
    }
  }, [user.isConnected, user.address, loadUserStamps]);

  if (!user.isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to view your ChronoStamp collection</p>
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-500">Please connect your wallet to access your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user.address?.slice(2, 4).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600 font-mono text-sm">
                {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{userStamps.length}</div>
            <div className="text-gray-600 mt-1">ChronoStamps Collected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {new Set(userStamps.map(stamp => stamp.organizer)).size}
            </div>
            <div className="text-gray-600 mt-1">Event Organizers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {userStamps.length > 0 ? new Date(Math.min(...userStamps.map(stamp => new Date(stamp.claimedAt).getTime()))).getFullYear() : '-'}
            </div>
            <div className="text-gray-600 mt-1">Member Since</div>
          </CardContent>
        </Card>
      </div>

      {/* ChronoStamps Collection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your ChronoStamps</h2>
          <Button 
            onClick={loadUserStamps} 
            disabled={isLoadingStamps}
            variant="outline"
            size="sm"
          >
            {isLoadingStamps ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {isLoadingStamps ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading your collection...</p>
          </div>
        ) : userStamps.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No ChronoStamps Yet</h3>
            <p className="text-gray-600 mb-6">Start collecting memories by claiming your first ChronoStamp</p>
            <Button 
              onClick={() => window.location.href = '/claim'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Claim Your First ChronoStamp
            </Button>
          </div>
        ) : (
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
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{stamp.eventName}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {stamp.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Event Date:</span>
                      <span>{new Date(stamp.eventDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Claimed:</span>
                      <span>{new Date(stamp.claimedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-mono text-xs text-gray-500">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}