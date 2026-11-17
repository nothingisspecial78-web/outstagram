import { Router, Request, Response } from 'express';
import { CreatePostcardSchema } from '../utils/validator.js';
import { PostcardService } from '../services/postcard.service.js';
import { config } from '../config.js';
import { Place } from '../types.js';

export const postcardRouter = Router();

// Mock / in-memory places for testing or standalone execution
const DEMO_PLACES: Record<string, Place> = {
  '22222222-2222-2222-2222-222222222201': {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Riverside Artisan Cafe',
    lat: 12.9716,
    lng: 77.5946,
    radius_m: 120,
  },
  '22222222-2222-2222-2222-222222222204': {
    id: '22222222-2222-2222-2222-222222222204',
    name: 'Demo Spot (Venue simulated)',
    lat: 0.0,
    lng: 0.0,
    radius_m: 500,
  },
};

postcardRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const parseResult = CreatePostcardSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'validation_error',
        details: parseResult.error.flatten(),
      });
    }

    const payload = parseResult.data;
    const place = DEMO_PLACES[payload.place_id] || {
      id: payload.place_id,
      name: 'Custom Location',
      lat: payload.lat,
      lng: payload.lng,
      radius_m: 150,
    };

    const validation = PostcardService.validatePostcardCreation(
      payload,
      place,
      false, // alreadyPostedToday
      config.allowDemoMode
    );

    if (!validation.valid) {
      return res.status(400).json({
        error: validation.error,
        message: validation.message,
        distance_m: validation.distanceMeters,
      });
    }

    return res.status(200).json({
      success: true,
      postcard_id: crypto.randomUUID(),
      message: 'Postcard validated and accepted.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'server_error', message: err.message });
  }
});
