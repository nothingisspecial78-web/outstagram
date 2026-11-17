import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CoachService } from '../src/services/coach.service.js';
import {
  buildCoachSystemPrompt,
  getRuleBasedFallback,
  FALLBACK_EXPERIMENTS,
} from '../src/ai/coach-prompt.js';

describe('AI Life Coach Rules, Prompts & Fallback Engine', () => {
  test('Enforces 3-messages-per-day rate limit', async () => {
    const habitContext = { daysDoneLast7: 4, stampsLast7: 4, meetupsLast7: 1 };

    await assert.rejects(
      async () => {
        await CoachService.processMessage('How do I reduce screen time?', 3, habitContext);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 429);
        assert.strictEqual(err.error, 'daily_limit_reached');
        return true;
      }
    );
  });

  test('Keyword fallback matches offline experiments correctly', () => {
    const scrollReply = getRuleBasedFallback('I have been scrolling on my phone late at night');
    assert.strictEqual(scrollReply, FALLBACK_EXPERIMENTS.scroll);

    const readReply = getRuleBasedFallback('I want to read more physical books');
    assert.strictEqual(readReply, FALLBACK_EXPERIMENTS.read);

    const friendReply = getRuleBasedFallback('I miss my friend Maya');
    assert.strictEqual(friendReply, FALLBACK_EXPERIMENTS.friend);

    const lonelyReply = getRuleBasedFallback('Feeling lonely today');
    assert.strictEqual(lonelyReply, FALLBACK_EXPERIMENTS.lonely);

    const boredReply = getRuleBasedFallback('I am feeling so bored');
    assert.strictEqual(boredReply, FALLBACK_EXPERIMENTS.bored);

    const defaultReply = getRuleBasedFallback('Hello coach');
    assert.strictEqual(defaultReply, FALLBACK_EXPERIMENTS.default);
  });

  test('System prompt adjusts when user completed 3 or fewer days (gentle goal shrinking)', () => {
    const strugglingUserContext = { daysDoneLast7: 2, stampsLast7: 1, meetupsLast7: 0 };
    const prompt = buildCoachSystemPrompt(strugglingUserContext);

    assert.ok(
      prompt.includes('The user completed few days. Make the experiment smaller than usual and never scold.'),
      'Prompt must adapt gently when user completed few days'
    );
  });

  test('System prompt strictly enforces offline experiments and forbids content recommendations', () => {
    const context = { daysDoneLast7: 6, stampsLast7: 5, meetupsLast7: 2 };
    const prompt = buildCoachSystemPrompt(context);

    assert.ok(prompt.includes('Never recommend content to consume'));
    assert.ok(prompt.includes('Reply in 3 sentences or fewer'));
    assert.ok(prompt.includes('You have no access to phone screen time data'));
  });

  test('Generates printable weekly habit letter', () => {
    const context = { daysDoneLast7: 5, stampsLast7: 6, meetupsLast7: 2 };
    const summary = CoachService.generateWeeklySummary('Sam', context, '2026-11-16');

    assert.ok(summary.includes('Hereabouts Weekly Letter'));
    assert.ok(summary.includes('Quests completed: 5'));
    assert.ok(summary.includes('Passport stamps earned: 6'));
    assert.ok(summary.includes('In-person meetups: 2'));
    assert.ok(summary.includes('Nothing to track, nothing to share.'));
  });
});
