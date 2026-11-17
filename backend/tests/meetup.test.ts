import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MeetupService } from '../src/services/meetup.service.js';
import { generateSixDigitCode, hashToken } from '../src/utils/crypto.js';
import { Chat, MeetupToken } from '../src/types.js';

describe('Meetup Handshake & 20-Message Wall Unlock Logic', () => {
  const lockedChat: Chat = {
    id: 'test-chat-uuid',
    user_a: 'user-alice',
    user_b: 'user-bob',
    message_count: 20,
    message_cap: 20,
    created_at: new Date().toISOString(),
  };

  test('Generates valid 6-digit numeric codes', () => {
    for (let i = 0; i < 50; i++) {
      const code = generateSixDigitCode();
      assert.strictEqual(code.length, 6);
      assert.match(code, /^\d{6}$/);
      const num = parseInt(code, 10);
      assert.ok(num >= 100000 && num <= 999999);
    }
  });

  test('Rejects token generation if chat is not locked', () => {
    const unlockedChat: Chat = { ...lockedChat, message_count: 14 };
    const res = MeetupService.createToken(unlockedChat, 'user-alice', 0);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'not_locked');
  });

  test('Rejects token generation if caller is not a member', () => {
    const res = MeetupService.createToken(lockedChat, 'stranger-charlie', 0);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'not_member');
  });

  test('Rejects token generation if rate limit (5/hour) exceeded', () => {
    const res = MeetupService.createToken(lockedChat, 'user-alice', 5);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'rate_limited');
  });

  test('Successfully creates token with valid hash and 5-min TTL', () => {
    const res = MeetupService.createToken(lockedChat, 'user-alice', 2);
    assert.strictEqual(res.valid, true);
    assert.ok(res.code);
    assert.ok(res.tokenHash);
    assert.ok(res.expiresAt);

    // Verify hash matches sha256(code || chat_id)
    const expectedHash = hashToken(res.code!, lockedChat.id);
    assert.strictEqual(res.tokenHash, expectedHash);
  });

  test('Prevents self-redemption (anti-self-redeem check)', () => {
    const code = '123456';
    const token: MeetupToken = {
      id: 'tok-1',
      chat_id: lockedChat.id,
      created_by: 'user-alice',
      token_hash: hashToken(code, lockedChat.id),
      attempts: 0,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    // Alice tries to redeem her own code
    const res = MeetupService.validateRedemption(token, lockedChat, 'user-alice', code);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'self_redeem');
  });

  test('Successfully validates redemption by friend, expanding cap by +20', () => {
    const code = '482913';
    const token: MeetupToken = {
      id: 'tok-2',
      chat_id: lockedChat.id,
      created_by: 'user-alice',
      token_hash: hashToken(code, lockedChat.id),
      attempts: 0,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    // Bob redeems Alice's code
    const res = MeetupService.validateRedemption(token, lockedChat, 'user-bob', code);
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.newCap, 40); // 20 + 20 = 40
  });

  test('Rejects already used token', () => {
    const code = '482913';
    const token: MeetupToken = {
      id: 'tok-3',
      chat_id: lockedChat.id,
      created_by: 'user-alice',
      token_hash: hashToken(code, lockedChat.id),
      attempts: 0,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      used_at: new Date().toISOString(),
    };

    const res = MeetupService.validateRedemption(token, lockedChat, 'user-bob', code);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'already_used');
  });

  test('Rejects expired token', () => {
    const code = '482913';
    const token: MeetupToken = {
      id: 'tok-4',
      chat_id: lockedChat.id,
      created_by: 'user-alice',
      token_hash: hashToken(code, lockedChat.id),
      attempts: 0,
      expires_at: new Date(Date.now() - 60 * 1000).toISOString(), // 1 min ago
    };

    const res = MeetupService.validateRedemption(token, lockedChat, 'user-bob', code);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'expired');
  });

  test('Rejects token after 5 failed attempts (brute force protection)', () => {
    const code = '482913';
    const token: MeetupToken = {
      id: 'tok-5',
      chat_id: lockedChat.id,
      created_by: 'user-alice',
      token_hash: hashToken(code, lockedChat.id),
      attempts: 5,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };

    const res = MeetupService.validateRedemption(token, lockedChat, 'user-bob', code);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.error, 'too_many_attempts');
  });
});
