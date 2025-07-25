import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ChronoStamp {
  id: number;
  tokenId: number;
  eventName: string;
  description: string;
  imageUrl: string;
  contractAddress?: string;
  claimedAt: Date;
  eventDate: Date;
  organizer: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  contractAddress?: string;
  eventCode: string;
  organizer: string;
  createdAt: Date;
  eventDate: Date;
  totalClaimed: number;
  maxSupply?: number;
}

interface AppState {
  // User State
  user: {
    address: string | null;
    isConnected: boolean;
    ownedStamps: ChronoStamp[];
  };
  
  // Events State
  events: {
    list: Event[];
    current: Event | null;
    featured: Event[];
  };
  
  // UI State
  ui: {
    isLoading: boolean;
    loadingMessage: string;
    modalOpen: boolean;
    currentModal: string | null;
  };
  
  // Actions
  setUser: (address: string | null, isConnected: boolean) => void;
  addOwnedStamp: (stamp: ChronoStamp) => void;
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  setCurrentEvent: (event: Event | null) => void;
  setLoading: (isLoading: boolean, message?: string) => void;
  setModal: (isOpen: boolean, modalType?: string | null) => void;
  
  // Mock Actions
  mockClaimStamp: (eventCode: string, contractAddress: string) => Promise<ChronoStamp>;
  mockCreateEvent: (eventData: Omit<Event, 'id' | 'contractAddress' | 'createdAt' | 'totalClaimed'>) => Promise<Event>;
}

export const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    // Initial State
    user: {
      address: null,
      isConnected: false,
      ownedStamps: [],
    },
    
    events: {
      list: [],
      current: null,
      featured: [],
    },
    
    ui: {
      isLoading: false,
      loadingMessage: '',
      modalOpen: false,
      currentModal: null,
    },
    
    // Actions
    setUser: (address, isConnected) => set((state) => ({
      user: { ...state.user, address, isConnected }
    })),
    
    addOwnedStamp: (stamp) => set((state) => ({
      user: {
        ...state.user,
        ownedStamps: [...state.user.ownedStamps, stamp]
      }
    })),
    
    setEvents: (events) => set((state) => ({
      events: { ...state.events, list: events }
    })),
    
    addEvent: (event) => set((state) => ({
      events: {
        ...state.events,
        list: [...state.events.list, event]
      }
    })),
    
    setCurrentEvent: (event) => set((state) => ({
      events: { ...state.events, current: event }
    })),
    
    setLoading: (isLoading, message = '') => set((state) => ({
      ui: { ...state.ui, isLoading, loadingMessage: message }
    })),
    
    setModal: (isOpen, modalType = null) => set((state) => ({
      ui: { ...state.ui, modalOpen: isOpen, currentModal: modalType }
    })),
    
    // Mock Implementation
    mockClaimStamp: async (eventCode: string, _contractAddress: string) => {
      const { events, addOwnedStamp, setEvents } = get();
      
      // Initialize with some mock events if list is empty
      if (events.list.length === 0) {
        const mockEvents: Event[] = [
          {
            id: '1',
            name: 'DevConf 2024',
            description: 'Annual developer conference with cutting-edge tech talks',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
            contractAddress: '0x1234567890123456789012345678901234567890',
            eventCode: 'DEVCONF2024',
            organizer: 'Tech Community',
            createdAt: new Date('2024-01-15'),
            eventDate: new Date('2024-07-15'),
            totalClaimed: 156,
            maxSupply: 500,
          },
          {
            id: '2',
            name: 'Web3 Summit',
            description: 'Exploring the future of decentralized web',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
            contractAddress: '0x2345678901234567890123456789012345678901',
            eventCode: 'WEB3SUMMIT',
            organizer: 'Blockchain Foundation',
            createdAt: new Date('2024-02-01'),
            eventDate: new Date('2024-08-20'),
            totalClaimed: 89,
            maxSupply: 300,
          },
          {
            id: '3',
            name: 'AI Workshop',
            description: 'Hands-on machine learning and AI development',
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
            contractAddress: '0x3456789012345678901234567890123456789012',
            eventCode: 'AIWORKSHOP',
            organizer: 'AI Lab',
            createdAt: new Date('2024-02-10'),
            eventDate: new Date('2024-06-10'),
            totalClaimed: 234,
            maxSupply: 250,
          }
        ];
        setEvents(mockEvents);
      }
      
      // Find event by code (ignore contractAddress parameter for better UX)
      const event = get().events.list.find(e => 
        e.eventCode.toLowerCase() === eventCode.toLowerCase()
      );
      
      if (!event) {
        throw new Error(`Event with code "${eventCode}" not found. Try: DEVCONF2024, WEB3SUMMIT, or AIWORKSHOP`);
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stamp: ChronoStamp = {
        id: Date.now(),
        tokenId: Math.floor(Math.random() * 10000),
        eventName: event.name,
        description: event.description,
        imageUrl: event.imageUrl,
        contractAddress: event.contractAddress,
        claimedAt: new Date(),
        eventDate: event.eventDate,
        organizer: event.organizer,
      };
      
      addOwnedStamp(stamp);
      return stamp;
    },
    
    mockCreateEvent: async (eventData) => {
      const { addEvent } = get();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const event: Event = {
        ...eventData,
        id: Date.now().toString(),
        contractAddress: `0x${Math.random().toString(16).slice(2, 42)}`,
        createdAt: new Date(),
        totalClaimed: 0,
      };
      
      addEvent(event);
      return event;
    },
  }))
);