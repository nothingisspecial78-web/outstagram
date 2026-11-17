import { getAIProvider } from '../ai/provider-factory.js';
import {
  buildCoachSystemPrompt,
  getRuleBasedFallback,
  UserHabitContext,
} from '../ai/coach-prompt.js';
import { CoachResponse } from '../types.js';

export class CoachService {
  /**
   * Processes a user chat message to the AI coach.
   */
  static async processMessage(
    userMessage: string,
    userMessagesTodayCount: number,
    habitContext: UserHabitContext
  ): Promise<CoachResponse> {
    // 1. Quota check: max 3 messages per day
    if (userMessagesTodayCount >= 3) {
      throw {
        statusCode: 429,
        error: 'daily_limit_reached',
        message: 'You have reached your 3 coach check-ins for today. Come back tomorrow.',
      };
    }

    const systemPrompt = buildCoachSystemPrompt(habitContext);
    const provider = getAIProvider();

    try {
      const reply = await provider.generateCompletion({
        systemPrompt,
        userMessage,
        timeoutMs: 8000,
      });

      return {
        reply,
        source: 'ai',
        remaining_today: Math.max(0, 3 - userMessagesTodayCount - 1),
      };
    } catch (err: any) {
      console.warn('AI call failed or timed out. Engaging rule-based fallback:', err.message);
      const fallbackReply = getRuleBasedFallback(userMessage);

      return {
        reply: fallbackReply,
        source: 'fallback',
        remaining_today: Math.max(0, 3 - userMessagesTodayCount - 1),
      };
    }
  }

  /**
   * Generates a quiet weekly offline habit letter.
   */
  static generateWeeklySummary(
    userName: string,
    habitContext: UserHabitContext,
    weekStartDate: string
  ): string {
    return (
      `Hereabouts Weekly Letter\n` +
      `Week of ${weekStartDate}\n\n` +
      `Dear ${userName},\n\n` +
      `This week you walked, noticed, and stepped away from screens. Here is what your week looked like:\n` +
      `• Quests completed: ${habitContext.daysDoneLast7} offline daily challenges.\n` +
      `• Passport stamps earned: ${habitContext.stampsLast7} real moments collected.\n` +
      `• In-person meetups: ${habitContext.meetupsLast7} face-to-face connections.\n\n` +
      `For the next seven days, try this one small adjustment:\n` +
      (habitContext.daysDoneLast7 <= 3
        ? `Read just 3 pages of a printed book in the evening, and put your phone in another room during one meal.\n\n`
        : `Take one 15-minute walk with your phone turned completely off.\n\n`) +
      `Nothing to track, nothing to share. Just notice how it feels.\n\n` +
      `Gently,\nYour Hereabouts Coach`
    );
  }
}
