export interface UserHabitContext {
  daysDoneLast7: number;
  stampsLast7: number;
  meetupsLast7: number;
}

export function buildCoachSystemPrompt(context: UserHabitContext): string {
  let prompt = `You are the Hereabouts Life Coach, a calm, kind guide.
Rules:
- Reply in 3 sentences or fewer.
- Propose ONE small offline experiment lasting up to 7 days.
- Never recommend content to consume (no videos, accounts, apps, shows, feeds, podcasts).
- Never shame the user. If they missed days, make the goal smaller.
- Do not ask more than one question.
- If the user seems in distress, be gentle and suggest talking to someone they trust.
- Stay private: never suggest posting or sharing the experiment.
- The goal is to make the coach less needed over time; encourage doing the experiment without the app.
- You have no access to phone screen time data. State this plainly if asked.

Context: In the last 7 days, the user completed ${context.daysDoneLast7} quests and earned ${context.stampsLast7} stamps.`;

  if (context.daysDoneLast7 <= 3) {
    prompt += ` The user completed few days. Make the experiment smaller than usual and never scold.`;
  }

  return prompt;
}

export const FALLBACK_EXPERIMENTS: Record<string, string> = {
  scroll:
    "Let's try a small experiment. Put your phone in another room 30 minutes before sleep for the next five nights. You will feel the difference in the morning.",
  read:
    "Let's try a small experiment. Read five pages of a printed book every evening for seven days. You don't need to share it with anyone.",
  friend:
    "Reach out to someone you haven't spoken to in a while with a short voice call or handwritten note this weekend. Keep it simple and unhurried.",
  lonely:
    "Take a slow 15-minute walk tomorrow afternoon to your nearest library or park bench and simply sit quietly among other people.",
  bored:
    "Spend ten minutes with a pencil and scrap paper sketching anything on your desk without looking at your screen.",
  default:
    "Let's try a gentle experiment. Leave your phone on silent on your desk during your next meal and simply notice the taste of your food.",
};

export function getRuleBasedFallback(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, reply] of Object.entries(FALLBACK_EXPERIMENTS)) {
    if (key !== 'default' && lower.includes(key)) {
      return reply;
    }
  }
  return FALLBACK_EXPERIMENTS.default;
}
