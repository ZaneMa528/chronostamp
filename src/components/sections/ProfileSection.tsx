'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/Tabs';
import { useAppStore } from '~/stores/useAppStore';
import { CreatedEventsTab } from './CreatedEventsTab';
import { MyStampsTab } from './MyStampsTab';

export function ProfileSection() {
  const { user } = useAppStore();

  if (!user.isConnected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Memory Collection</h1>
          <p className="text-gray-600 mb-8">Connect your wallet to view your ChronoStamp journey</p>
          <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-500">Please connect your wallet to access your memory collection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Simple Profile Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Memory Collection</h1>
        <p className="text-gray-600 font-mono">
          {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
        </p>
      </div>

      {/* Main Content - Focus on Collections */}
      <Tabs defaultValue="stamps" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-white shadow-sm">
            <TabsTrigger value="stamps" className="px-6 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              My Memories
            </TabsTrigger>
            <TabsTrigger value="created" className="px-6 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Created Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stamps">
          <MyStampsTab userAddress={user.address!} />
        </TabsContent>

        <TabsContent value="created">
          <CreatedEventsTab userAddress={user.address!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}