import type { Event, ChronoStamp } from '~/stores/useAppStore';

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

interface ClaimResponse {
  stamp: ChronoStamp;
  transaction: {
    hash: string;
    blockNumber: number;
    gasUsed: number;
  };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as ApiResponse<T>;
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: 'Failed to fetch',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Events API
  static async getEvents(): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>('/events');
  }

  static async getEvent(id: string): Promise<ApiResponse<Event & { 
    stats: {
      totalClaimed: number;
      maxSupply?: number;
      remainingSupply?: number;
      claimRate?: number;
    };
    metadata: {
      blockchain: string;
      tokenStandard: string;
      royalty: string;
      ipfsHash: string;
    };
  }>> {
    return this.request<Event & { 
      stats: {
        totalClaimed: number;
        maxSupply?: number;
        remainingSupply?: number;
        claimRate?: number;
      };
      metadata: {
        blockchain: string;
        tokenStandard: string;
        royalty: string;
        ipfsHash: string;
      };
    }>(`/events/${id}`);
  }

  static async createEvent(eventData: {
    name: string;
    description: string;
    imageUrl: string;
    eventCode: string;
    organizer: string;
    eventDate: Date;
    maxSupply?: number;
  }): Promise<ApiResponse<Event>> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Claim API
  static async claimStamp(
    eventCode: string,
    userAddress: string
  ): Promise<ApiResponse<ClaimResponse>> {
    return this.request<ClaimResponse>('/claim', {
      method: 'POST',
      body: JSON.stringify({ eventCode, userAddress }),
    });
  }

  static async getUserStamps(userAddress: string): Promise<ApiResponse<ChronoStamp[]>> {
    return this.request<ChronoStamp[]>(`/claim?address=${encodeURIComponent(userAddress)}`);
  }
}