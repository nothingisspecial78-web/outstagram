import { isUserAtPlace, isValidCoordinates } from '../utils/geo.js';
import { decodeAndValidateBase64Image } from '../utils/image.js';
import { CreatePostcardRequest, Place } from '../types.js';

export class PostcardService {
  /**
   * Validates all constraints before creating a postcard.
   */
  static validatePostcardCreation(
    payload: CreatePostcardRequest,
    targetPlace: Place,
    alreadyPostedToday: boolean,
    allowDemoMode: boolean
  ): {
    valid: boolean;
    error?: string;
    message?: string;
    sanitizedImageBuffer?: Buffer;
    distanceMeters?: number;
  } {
    // 1. Caption length check (8 to 140 chars)
    const captionTrimmed = payload.caption ? payload.caption.trim() : '';
    if (captionTrimmed.length < 8 || captionTrimmed.length > 140) {
      return {
        valid: false,
        error: 'caption_invalid',
        message: 'Caption must be between 8 and 140 characters.',
      };
    }

    // 2. One postcard per day enforcement
    if (alreadyPostedToday) {
      return {
        valid: false,
        error: 'already_posted_today',
        message: 'Only one postcard per day is allowed.',
      };
    }

    // 3. Coordinate validation
    const userCoords = { lat: payload.lat, lng: payload.lng };
    if (!isValidCoordinates(userCoords)) {
      return {
        valid: false,
        error: 'invalid_coordinates',
        message: 'User coordinates are outside valid geographic range.',
      };
    }

    // 4. Place proximity verification
    const isDemo = Boolean(payload.demo_mode && allowDemoMode);
    let distance = 0;

    if (!isDemo) {
      const placeCoords = { lat: targetPlace.lat, lng: targetPlace.lng };
      const proximity = isUserAtPlace(
        userCoords,
        placeCoords,
        targetPlace.radius_m,
        payload.accuracy_m ?? 20
      );

      distance = proximity.distanceMeters;

      if (!proximity.atPlace) {
        return {
          valid: false,
          error: 'not_at_place',
          distanceMeters: distance,
          message: `You are ${distance}m away from ${targetPlace.name}. Must be within ${targetPlace.radius_m}m.`,
        };
      }
    }

    // 5. Image decode, size check, and EXIF strip
    const imgResult = decodeAndValidateBase64Image(payload.image_base64);
    if (!imgResult.valid || !imgResult.buffer) {
      return {
        valid: false,
        error: imgResult.error || 'image_invalid',
        message: 'Image must be a valid JPEG under 1.5MB.',
      };
    }

    return {
      valid: true,
      sanitizedImageBuffer: imgResult.buffer,
      distanceMeters: distance,
    };
  }
}
