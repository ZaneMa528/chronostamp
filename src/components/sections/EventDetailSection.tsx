'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { Input } from '~/components/ui/Input';
import { useAppStore } from '~/stores/useAppStore';
import { useNotificationStore } from '~/stores/useNotificationStore';
import { ApiClient } from '~/lib/api';
import type { Event } from '~/stores/useAppStore';

interface EventDetailSectionProps {
  eventId: string;
}

interface EventWithDetails extends Event {
  stats: {
    totalClaimed: number;
    maxSupply?: number;
    remainingSupply?: number | null;
    claimRate?: number | null;
  };
  metadata: {
    blockchain: string;
    tokenStandard: string;
    royalty: string;
    ipfsHash: string;
  };
}

export function EventDetailSection({ eventId }: EventDetailSectionProps) {
  const { user, addOwnedStamp, setLoading, ui } = useAppStore();
  const { showSuccess, showError, showWarning, showInfo } = useNotificationStore();
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventCode, setEventCode] = useState('');

  const loadEventDetails = useCallback(async () => {
    try {
      setIsLoadingEvent(true);
      setError(null);
      
      const response = await ApiClient.getEvent(eventId);
      
      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError(response.error ?? 'Failed to load event details');
      }
    } catch (error) {
      setError('Error loading event details');
      console.error('Error loading event details:', error);
    } finally {
      setIsLoadingEvent(false);
    }
  }, [eventId]);

  useEffect(() => {
    void loadEventDetails();
  }, [eventId, loadEventDetails]);

  const handleClaimStamp = async () => {
    if (!event || !user.isConnected || !user.address) {
      showWarning('Please connect your wallet first');
      return;
    }

    if (!eventCode.trim()) {
      showWarning('Please enter the event code provided at the event');
      return;
    }

    try {
      setLoading(true, 'Claiming your ChronoStamp...');
      
      const response = await ApiClient.claimStamp(eventCode.toUpperCase(), user.address);
      
      if (!response.success) {
        throw new Error(response.message ?? response.error ?? 'Failed to claim ChronoStamp');
      }

      if (response.data) {
        addOwnedStamp(response.data.stamp);
        showSuccess(
          `ChronoStamp claimed successfully! 🎉`,
          {
            title: 'Claim Successful',
            duration: 8000,
            actions: [{
              label: 'View Transaction',
              onClick: () => {
                if (response.data?.transaction?.hash) {
                  window.open(`https://etherscan.io/tx/${response.data.transaction.hash}`, '_blank');
                }
              }
            }]
          }
        );
        // Refresh event details to update stats and clear the input
        void loadEventDetails();
        setEventCode('');
      }
    } catch (error) {
      showError('Failed to claim ChronoStamp: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4 text-sm sm:text-base">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{error ?? 'The event you are looking for does not exist.'}</p>
          <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const isEventActive = new Date(event.eventDate) > new Date();
  const isSoldOut = event.stats.maxSupply && event.stats.totalClaimed >= event.stats.maxSupply;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Back Navigation */}
      <div className="mb-4 sm:mb-6">
        <Button 
          variant="outline" 
          onClick={() => void window.history.back()}
          className="flex items-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Event Image */}
        <div className="space-y-4 sm:space-y-6 order-first lg:order-none">
          <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
            <img 
              src={event.imageUrl} 
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Blockchain:</span>
                <span className="font-medium">{event.metadata.blockchain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Token Standard:</span>
                <span className="font-medium">{event.metadata.tokenStandard}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Royalty:</span>
                <span className="font-medium">{event.metadata.royalty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contract:</span>
                <span className="font-mono text-sm">
                  {event.contractAddress.slice(0, 6)}...{event.contractAddress.slice(-4)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    void navigator.clipboard.writeText(event.contractAddress);
                    showInfo('Contract address copied to clipboard!');
                  }}
                >
                  Copy Contract Address
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details */}
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{event.name}</h1>
              <div className="flex gap-2">
                {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
                {!isEventActive && !isSoldOut && <Badge variant="secondary">Past Event</Badge>}
                {isEventActive && !isSoldOut && <Badge variant="default">Active</Badge>}
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-4">{event.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                <span className="hidden sm:inline">at {new Date(event.eventDate).toLocaleTimeString()}</span>
              </div>
              <div className="block sm:hidden text-xs text-gray-500">
                {new Date(event.eventDate).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{event.stats.totalClaimed}</div>
                <div className="text-sm text-gray-600">Total Claimed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {event.stats.maxSupply ? event.stats.remainingSupply ?? 0 : '∞'}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {event.stats.maxSupply && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Claim Progress</span>
                <span>{event.stats.claimRate ?? 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${event.stats.claimRate ?? 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* How to Claim */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Claim</CardTitle>
              <CardDescription>Get your ChronoStamp at the event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Attend the Event</p>
                    <p>Be present at the event location during the specified time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Get the Secret Code</p>
                    <p>Event organizers will reveal the claim code during the event</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Claim Your ChronoStamp</p>
                    <p>Use the code on our claim page to mint your digital memory</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Claim Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Claim Your ChronoStamp</CardTitle>
              <CardDescription>
                Enter the secret code provided at the event to claim your digital memory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user.isConnected ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">Connect your wallet to claim this ChronoStamp</p>
                  <Button disabled className="w-full h-12 sm:h-auto text-sm sm:text-base" size="lg">
                    Connect Wallet First
                  </Button>
                </div>
              ) : isSoldOut ? (
                <div className="text-center">
                  <p className="text-red-600 mb-4 text-sm sm:text-base">This event has reached its maximum supply</p>
                  <Button disabled className="w-full h-12 sm:h-auto text-sm sm:text-base" size="lg">
                    Sold Out
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="eventCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Code
                    </label>
                    <Input
                      id="eventCode"
                      placeholder="Enter the secret code from the event"
                      value={eventCode}
                      onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                      disabled={ui.isLoading}
                      className="text-center text-base sm:text-lg font-mono tracking-wider h-12 sm:h-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      The event organizer will provide this code during the event
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleClaimStamp}
                    disabled={ui.isLoading || !eventCode.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 sm:h-auto text-sm sm:text-base"
                    size="lg"
                  >
                    {ui.isLoading ? ui.loadingMessage : 'Claim ChronoStamp'}
                  </Button>
                  
                  {!eventCode.trim() ? (
                    <p className="text-xs sm:text-sm text-gray-400 text-center">
                      Enter the event code to continue
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-green-600 text-center">
                      ✓ Ready to claim your ChronoStamp!
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Organizer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {event.organizer.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">Event Organizer</div>
                  <div className="text-sm text-gray-600 font-mono">
                    {event.organizer.slice(0, 6)}...{event.organizer.slice(-4)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}