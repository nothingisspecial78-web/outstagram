import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  calculateDistanceMeters,
  isUserAtPlace,
  isValidCoordinates,
} from '../src/utils/geo.js';

describe('Geo & Haversine Distance Logic', () => {
  test('Identical coordinates yield 0 meters distance', () => {
    const point = { lat: 12.9716, lng: 77.5946 };
    const dist = calculateDistanceMeters(point, point);
    assert.strictEqual(Math.round(dist), 0);
  });

  test('Calculates distance accurately between two known points', () => {
    // Bangalore MG Road to Indiranagar (~3.8km = ~3800m)
    const mgRoad = { lat: 12.9756, lng: 77.6066 };
    const indiranagar = { lat: 12.9784, lng: 77.6408 };

    const distance = calculateDistanceMeters(mgRoad, indiranagar);
    assert.ok(distance > 3600 && distance < 3900, `Expected ~3.7km, got ${distance}m`);
  });

  test('Validates geographic coordinate boundaries', () => {
    assert.strictEqual(isValidCoordinates({ lat: 0, lng: 0 }), true);
    assert.strictEqual(isValidCoordinates({ lat: 90, lng: 180 }), true);
    assert.strictEqual(isValidCoordinates({ lat: -90, lng: -180 }), true);

    assert.strictEqual(isValidCoordinates({ lat: 91, lng: 0 }), false);
    assert.strictEqual(isValidCoordinates({ lat: 0, lng: 181 }), false);
    assert.strictEqual(isValidCoordinates({ lat: NaN, lng: 50 }), false);
  });

  test('Correctly determines if user is within place radius', () => {
    const place = { lat: 12.9716, lng: 77.5946 };
    const nearbyUser = { lat: 12.9718, lng: 77.5948 }; // ~30m away

    const result = isUserAtPlace(nearbyUser, place, 120, 10);
    assert.strictEqual(result.atPlace, true);
    assert.ok(result.distanceMeters < 50);
  });

  test('Rejects user outside place radius', () => {
    const place = { lat: 12.9716, lng: 77.5946 };
    const farUser = { lat: 12.9800, lng: 77.6100 }; // ~1.9km away

    const result = isUserAtPlace(farUser, place, 100, 10);
    assert.strictEqual(result.atPlace, false);
    assert.ok(result.distanceMeters > 1000);
  });

  test('Caps accuracy bonus at 50m max', () => {
    const place = { lat: 12.9716, lng: 77.5946 };
    const user = { lat: 12.9716, lng: 77.5946 };

    const result = isUserAtPlace(user, place, 100, 200); // 200m accuracy claimed
    assert.strictEqual(result.allowedRadiusMeters, 150); // 100 + min(200, 50) = 150
  });
});
