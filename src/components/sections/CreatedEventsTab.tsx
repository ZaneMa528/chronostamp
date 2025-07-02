'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { Badge } from '~/components/ui/Badge';
import { ApiClient } from '~/lib/api';
import type { Event } from '~/stores/useAppStore';

interface CreatedEventsTabProps {
  userAddress: string;
}

export function CreatedEventsTab({ userAddress }: CreatedEventsTabProps) {
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCreatedEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.getUserCreatedEvents(userAddress);
      
      if (response.success && response.data) {
        setCreatedEvents(response.data);
      } else {
        console.error('Failed to load created events:', response.error);
      }
    } catch (error) {
      console.error('Error loading created events:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  useEffect(() => {
    void loadCreatedEvents();
  }, [loadCreatedEvents]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading your created events...</p>
      </div>
    );
  }

  if (createdEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Created Yet</h3>
        <p className="text-gray-600 mb-6">Start creating memorable experiences by organizing your first ChronoStamp event</p>
        <Link href="/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create Your First Event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Created Events ({createdEvents.length})
        </h3>
        <Button 
          onClick={loadCreatedEvents} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {createdEvents.map((event) => {
          const isEventActive = new Date(event.eventDate) > new Date();
          const isSoldOut = event.maxSupply && event.totalClaimed >= event.maxSupply;
          const claimRate = event.maxSupply ? Math.round((event.totalClaimed / event.maxSupply) * 100) : null;
          
          return (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                <img 
                  src={event.imageUrl} 
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
                  {!isEventActive && !isSoldOut && <Badge variant="secondary">Past Event</Badge>}
                  {isEventActive && !isSoldOut && <Badge variant="default">Active</Badge>}
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{event.totalClaimed}</div>
                    <div className="text-xs text-gray-600">Claimed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {event.maxSupply ? (event.maxSupply - event.totalClaimed) : '∞'}
                    </div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                </div>

                {/* Progress Bar */}
                {event.maxSupply && claimRate !== null && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{claimRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${claimRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Event Date */}
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/event/${event.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/event/${event.id}`;
                      void navigator.clipboard.writeText(url);
                      alert('Event link copied to clipboard!');
                    }}
                  >
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}