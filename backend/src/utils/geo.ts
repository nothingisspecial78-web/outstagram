/**
 * Geolocation utilities for Hereabouts.
 * Calculates accurate great-circle distances between points on Earth using the Haversine formula.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export const EARTH_RADIUS_METERS = 6371000;

/**
 * Converts degrees to radians.
 */
export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the great-circle distance between two geographic coordinates in meters.
 * Uses the Haversine formula with numerical stability for small distances.
 */
export function calculateDistanceMeters(point1: Coordinates, point2: Coordinates): number {
  const dLat = degreesToRadians(point2.lat - point1.lat);
  const dLng = degreesToRadians(point2.lng - point1.lng);

  const lat1Rad = degreesToRadians(point1.lat);
  const lat2Rad = degreesToRadians(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Validates whether GPS coordinates are within valid world bounds.
 */
export function isValidCoordinates(coords: Coordinates): boolean {
  if (typeof coords.lat !== 'number' || typeof coords.lng !== 'number') return false;
  if (isNaN(coords.lat) || isNaN(coords.lng)) return false;
  return coords.lat >= -90 && coords.lat <= 90 && coords.lng >= -180 && coords.lng <= 180;
}

/**
 * Determines if a user coordinate is within the permitted radius of a target place.
 * Accounts for GPS inaccuracy up to a safe 50m cap.
 */
export function isUserAtPlace(
  userCoords: Coordinates,
  placeCoords: Coordinates,
  placeRadiusMeters: number,
  accuracyMeters = 20
): { atPlace: boolean; distanceMeters: number; allowedRadiusMeters: number } {
  const distanceMeters = calculateDistanceMeters(userCoords, placeCoords);
  const allowedRadiusMeters = placeRadiusMeters + Math.min(Math.max(accuracyMeters, 0), 50);

  return {
    atPlace: distanceMeters <= allowedRadiusMeters,
    distanceMeters: Math.round(distanceMeters),
    allowedRadiusMeters,
  };
}
