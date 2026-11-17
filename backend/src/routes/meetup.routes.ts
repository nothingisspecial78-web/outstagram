import { Router, Request, Response } from 'express';
import { CreateMeetupTokenSchema, RedeemMeetupTokenSchema } from '../utils/validator.js';
import { MeetupService } from '../services/meetup.service.js';
import { Chat, MeetupToken } from '../types.js';

export const meetupRouter = Router();

// In-memory demo store for standalone execution / testing
const mockChats: Record<string, Chat> = {
  'chat-123': {
    id: 'chat-123',
    user_a: 'user-alice',
    user_b: 'user-bob',
    message_count: 20,
    message_cap: 20,
    created_at: new Date().toISOString(),
  },
};

const mockTokens: Record<string, MeetupToken> = {};

meetupRouter.post('/token/create', (req: Request, res: Response) => {
  const parseResult = CreateMeetupTokenSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'validation_error', details: parseResult.error.flatten() });
  }

  const { chat_id } = parseResult.data;
  const chat = mockChats[chat_id];
  if (!chat) {
    return res.status(404).json({ error: 'chat_not_found' });
  }

  // Caller simulated as user_a (Alice)
  const callerId = (req.headers['x-user-id'] as string) || chat.user_a;

  const result = MeetupService.createToken(chat, callerId, 0);
  if (!result.valid) {
    return res.status(400).json({ error: result.error, message: result.message });
  }

  const tokenId = crypto.randomUUID();
  mockTokens[result.code!] = {
    id: tokenId,
    chat_id: chat.id,
    created_by: callerId,
    token_hash: result.tokenHash!,
    attempts: 0,
    expires_at: result.expiresAt!,
  };

  return res.status(200).json({
    success: true,
    code: result.code,
    expires_at: result.expiresAt,
  });
});

meetupRouter.post('/token/redeem', (req: Request, res: Response) => {
  const parseResult = RedeemMeetupTokenSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'validation_error', details: parseResult.error.flatten() });
  }

  const { code } = parseResult.data;
  const token = mockTokens[code];
  if (!token) {
    return res.status(400).json({ error: 'invalid_code', message: 'Token not found or invalid' });
  }

  const chat = mockChats[token.chat_id];
  if (!chat) {
    return res.status(404).json({ error: 'chat_not_found' });
  }

  // Caller simulated as user_b (Bob)
  const redeemerId = (req.headers['x-user-id'] as string) || chat.user_b;

  const validation = MeetupService.validateRedemption(token, chat, redeemerId, code);
  if (!validation.valid) {
    token.attempts += 1;
    return res.status(400).json({ error: validation.error, message: validation.message });
  }

  // Mark token redeemed and unlock chat
  token.used_at = new Date().toISOString();
  token.used_by = redeemerId;
  chat.message_cap = validation.newCap!;

  return res.status(200).json({
    success: true,
    chat_id: chat.id,
    new_cap: validation.newCap,
    message: 'Meetup verified! 20 more messages unlocked and stamps awarded.',
  });
});
