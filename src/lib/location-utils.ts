/**
 * Location utilities for ChronoStamp location-based claiming
 */

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData extends LocationCoordinates {
  name?: string;
  accuracy?: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export function calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (coord1.latitude * Math.PI) / 180;
  const lat2Rad = (coord2.latitude * Math.PI) / 180;
  const deltaLatRad = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLngRad = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

/**
 * Get user's current location using browser geolocation API
 * @param options Geolocation options
 * @returns Promise with location data
 */
export function getCurrentLocation(options?: PositionOptions): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 300000, // 5 minutes cache
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      defaultOptions,
    );
  });
}

/**
 * Format distance for display
 * @param distanceInMeters Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`;
}

/**
 * Check if user is within allowed range of event location
 * @param userLocation User's current location
 * @param eventLocation Event location
 * @param allowedRadius Allowed radius in meters
 * @returns Object with isWithinRange and distance
 */
export function checkLocationRange(
  userLocation: LocationCoordinates,
  eventLocation: LocationCoordinates,
  allowedRadius: number,
): { isWithinRange: boolean; distance: number; distanceFormatted: string } {
  const distance = calculateDistance(userLocation, eventLocation);
  return {
    isWithinRange: distance <= allowedRadius,
    distance,
    distanceFormatted: formatDistance(distance),
  };
}

/**
 * Format location error message for user display
 * @param eventLocationName Event location name
 * @param allowedRadius Allowed radius in meters
 * @param userDistance User's distance from event
 * @returns Formatted error message
 */
export function formatLocationError(eventLocationName: string, allowedRadius: number, userDistance: number): string {
  const allowedDistanceFormatted = formatDistance(allowedRadius);
  const userDistanceFormatted = formatDistance(userDistance);

  return `You are ${userDistanceFormatted} away from ${eventLocationName}. Please be within ${allowedDistanceFormatted} to claim this ChronoStamp.`;
}

/**
 * Validate coordinate values
 * @param latitude Latitude value
 * @param longitude Longitude value
 * @returns True if coordinates are valid
 */
export function isValidCoordinates(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}
