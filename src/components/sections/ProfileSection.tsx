"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/Tabs";
import { useAppStore } from "~/stores/useAppStore";
import { CreatedEventsTab } from "./CreatedEventsTab";
import { MyStampsTab } from "./MyStampsTab";

export function ProfileSection() {
  const { user } = useAppStore();

  if (!user.isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="text-center">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Your Memory Collection
          </h1>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-600">
            Connect your wallet to view your ChronoStamp journey
          </p>
          <div className="mx-auto max-w-sm sm:max-w-md rounded-lg border bg-white p-6 sm:p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              Please connect your wallet to access your memory collection
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Main Content - Focus on Collections */}
      <Tabs defaultValue="stamps" className="w-full">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <TabsList className="bg-white shadow-sm w-full sm:w-auto">
            <TabsTrigger value="stamps" className="px-3 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none">
              <svg
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-xs sm:text-sm">My Memories</span>
            </TabsTrigger>
            <TabsTrigger value="created" className="px-3 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none">
              <svg
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-xs sm:text-sm">Created Events</span>
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
