import { Router, Request, Response } from 'express';
import { GroupService, GroupMeetupRecord } from '../services/group.service.js';

export const groupRouter = Router();

const mockGroups: Record<string, GroupMeetupRecord> = {};

groupRouter.post('/create', (req: Request, res: Response) => {
  const hostId = (req.headers['x-user-id'] as string) || 'host-1';
  const group = GroupService.createGroupCode(hostId);

  const groupId = crypto.randomUUID();
  mockGroups[group.code] = {
    id: groupId,
    host_id: hostId,
    code_hash: group.tokenHash,
    expires_at: group.expiresAt,
    members: [],
  };

  return res.status(200).json({
    success: true,
    group_id: groupId,
    code: group.code,
    expires_at: group.expiresAt,
  });
});

groupRouter.post('/join', (req: Request, res: Response) => {
  const userId = (req.headers['x-user-id'] as string) || 'guest-1';
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'invalid_code', message: 'Group code required' });
  }

  const group = mockGroups[code];
  if (!group) {
    return res.status(404).json({ error: 'not_found', message: 'Group code not found' });
  }

  const result = GroupService.joinGroup(group, userId, code);
  if (!result.success) {
    return res.status(400).json({ error: result.error, message: result.message });
  }

  group.members.push(userId);

  return res.status(200).json(result);
});
