'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '~/components/ui/Button';
import { EventCard } from '~/components/ui/EventCard';
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
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your created events...</p>
      </div>
    );
  }

  if (createdEvents.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">No Events Created Yet</h3>
        <p className="mb-6 text-gray-600">
          Start creating memorable experiences by organizing your first ChronoStamp event
        </p>
        <Link href="/create">
          <Button className="bg-blue-600 hover:bg-blue-700">Create Your First Event</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Created Events ({createdEvents.length})</h3>
        <Button onClick={loadCreatedEvents} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {createdEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            size="md"
            onShare={(url) => {
              void navigator.clipboard.writeText(url);
              alert('Event link copied to clipboard!');
            }}
          />
        ))}
      </div>
    </div>
  );
}
