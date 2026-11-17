import { generateSixDigitCode, hashToken, timingSafeEqualString } from '../utils/crypto.js';
import { Chat, MeetupToken } from '../types.js';

export class MeetupService {
  /**
   * Prepares and validates a new meetup token for a locked chat.
   */
  static createToken(
    chat: Chat,
    userId: string,
    tokensCreatedInLastHour: number
  ): {
    valid: boolean;
    error?: string;
    message?: string;
    code?: string;
    tokenHash?: string;
    expiresAt?: string;
  } {
    // 1. Verify caller is a member
    if (chat.user_a !== userId && chat.user_b !== userId) {
      return {
        valid: false,
        error: 'not_member',
        message: 'You are not a member of this chat.',
      };
    }

    // 2. Verify chat is locked
    if (chat.message_count < chat.message_cap) {
      return {
        valid: false,
        error: 'not_locked',
        message: `Chat is not locked yet (${chat.message_count}/${chat.message_cap}).`,
      };
    }

    // 3. Rate limiting: max 5 tokens per hour
    if (tokensCreatedInLastHour >= 5) {
      return {
        valid: false,
        error: 'rate_limited',
        message: 'Rate limit reached: at most 5 codes per hour.',
      };
    }

    const code = generateSixDigitCode();
    const tokenHash = hashToken(code, chat.id);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes TTL

    return {
      valid: true,
      code,
      tokenHash,
      expiresAt,
    };
  }

  /**
   * Validates redemption of a meetup code by the recipient.
   */
  static validateRedemption(
    token: MeetupToken,
    chat: Chat,
    redeemerUserId: string,
    inputCode: string
  ): {
    valid: boolean;
    error?: string;
    message?: string;
    newCap?: number;
  } {
    // 1. Verify redeemer is a member of the chat
    if (chat.user_a !== redeemerUserId && chat.user_b !== redeemerUserId) {
      return {
        valid: false,
        error: 'not_member',
        message: 'You are not a participant in this conversation.',
      };
    }

    // 2. Anti-self-redeem: caller cannot be the creator of the code
    if (token.created_by === redeemerUserId) {
      return {
        valid: false,
        error: 'self_redeem',
        message: 'You cannot redeem your own meetup code. Your friend must enter it.',
      };
    }

    // 3. Check attempt throttling (max 5 attempts)
    if (token.attempts >= 5) {
      return {
        valid: false,
        error: 'too_many_attempts',
        message: 'Too many failed attempts. This code is locked.',
      };
    }

    // 4. Check already used
    if (token.used_at) {
      return {
        valid: false,
        error: 'already_used',
        message: 'This code has already been redeemed.',
      };
    }

    // 5. Check expired
    if (new Date(token.expires_at).getTime() < Date.now()) {
      return {
        valid: false,
        error: 'expired',
        message: 'This code has expired (5-minute limit).',
      };
    }

    // 6. Verify hash
    const candidateHash = hashToken(inputCode, chat.id);
    if (!timingSafeEqualString(token.token_hash, candidateHash)) {
      return {
        valid: false,
        error: 'invalid_code',
        message: 'The code you entered does not match.',
      };
    }

    const newCap = (chat.message_cap || 20) + 20;

    return {
      valid: true,
      newCap,
    };
  }
}
