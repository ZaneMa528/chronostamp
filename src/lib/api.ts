import type { Event, ChronoStamp } from "~/stores/useAppStore";

const API_BASE = "";

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

interface ClaimSignatureResponse {
  contractAddress: string;
  signature: string;
  nonce: string;
  userAddress: string;
  eventCode: string;
  eventName: string;
  eventId: string;
  eventData: {
    name: string;
    description: string;
    imageUrl: string;
    eventDate: string;
    organizer: string;
  };
}

export class ApiClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE}/api${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        // Return the error response with details instead of throwing generic error
        return {
          success: false,
          error: data.error ?? `HTTP error! status: ${response.status}`,
          message:
            data.message ?? `Request failed with status ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: "Failed to fetch",
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Events API
  static async getEvents(): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>("/events");
  }

  static async getUserCreatedEvents(
    userAddress: string,
  ): Promise<ApiResponse<Event[]>> {
    return this.request<Event[]>(
      `/events?organizer=${encodeURIComponent(userAddress)}`,
    );
  }

  static async getEvent(id: string): Promise<
    ApiResponse<
      Event & {
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
      }
    >
  > {
    return this.request<
      Event & {
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
      }
    >(`/events/${id}`);
  }

  static async createEvent(eventData: {
    name: string;
    description: string;
    imageUrl: string;
    eventCode: string;
    organizer: string;
    eventDate: Date;
    maxSupply?: number;
    contractAddress: string;
    metadataIpfsHash: string;
  }): Promise<ApiResponse<Event>> {
    return this.request<Event>("/events", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  // Claim API - Get signature for Web3 claim
  static async getClaimSignature(
    eventCode: string,
    userAddress: string,
  ): Promise<ApiResponse<ClaimSignatureResponse>> {
    return this.request<ClaimSignatureResponse>("/claim", {
      method: "POST",
      body: JSON.stringify({ eventCode, userAddress }),
    });
  }

  // Record successful claim transaction
  static async recordClaim(
    eventId: string,
    userAddress: string,
    transactionHash: string,
    tokenId: string,
    blockNumber?: number,
    gasUsed?: number,
  ): Promise<ApiResponse<ClaimResponse>> {
    return this.request<ClaimResponse>("/claim/record", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        userAddress,
        transactionHash,
        tokenId,
        blockNumber,
        gasUsed,
      }),
    });
  }

  // Legacy method for backward compatibility (now calls Web3 flow)
  static async claimStamp(
    eventCode: string,
    userAddress: string,
  ): Promise<ApiResponse<ClaimResponse>> {
    // This method is kept for compatibility but should be replaced with Web3 flow
    // For now, it just gets the signature - frontend should handle the rest
    const signatureResponse = await this.getClaimSignature(
      eventCode,
      userAddress,
    );

    if (!signatureResponse.success) {
      return {
        success: false,
        error: signatureResponse.error,
        message: signatureResponse.message,
      };
    }

    // Return a response indicating Web3 interaction is needed
    throw new Error(
      "Web3 interaction required - use getClaimSignature() instead",
    );
  }

  static async getUserStamps(
    userAddress: string,
  ): Promise<ApiResponse<ChronoStamp[]>> {
    return this.request<ChronoStamp[]>(
      `/claim?address=${encodeURIComponent(userAddress)}`,
    );
  }
}
