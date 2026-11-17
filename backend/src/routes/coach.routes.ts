import { Router, Request, Response } from 'express';
import { CoachMessageSchema } from '../utils/validator.js';
import { CoachService } from '../services/coach.service.js';

export const coachRouter = Router();

// Simulated in-memory usage counter for standalone execution
const userDailyMessageCount: Record<string, number> = {};

coachRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const parseResult = CoachMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'validation_error', details: parseResult.error.flatten() });
    }

    const { action, message = '' } = parseResult.data;
    const userId = (req.headers['x-user-id'] as string) || 'demo-user-1';

    const habitContext = {
      daysDoneLast7: 5,
      stampsLast7: 6,
      meetupsLast7: 2,
    };

    if (action === 'summary') {
      const weekStart = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const summaryText = CoachService.generateWeeklySummary('Friend', habitContext, weekStart);
      return res.status(200).json({ success: true, summary: summaryText });
    }

    const todayCount = userDailyMessageCount[userId] || 0;

    const response = await CoachService.processMessage(message, todayCount, habitContext);
    userDailyMessageCount[userId] = todayCount + 1;

    return res.status(200).json({
      success: true,
      ...response,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({ error: err.error || 'server_error', message: err.message });
  }
});
