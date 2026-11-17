import { generateSixDigitCode, hashToken } from '../utils/crypto.js';

export interface GroupMeetupRecord {
  id: string;
  host_id: string;
  code_hash: string;
  expires_at: string;
  members: string[]; // member user ids
}

export class GroupService {
  /**
   * Host creates a 10-minute group code.
   */
  static createGroupCode(hostId: string): {
    code: string;
    tokenHash: string;
    expiresAt: string;
  } {
    const code = generateSixDigitCode();
    const tokenHash = hashToken(code, 'group-salt');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    return { code, tokenHash, expiresAt };
  }

  /**
   * Member joins group using code.
   */
  static joinGroup(
    group: GroupMeetupRecord,
    userId: string,
    inputCode: string
  ): {
    success: boolean;
    error?: string;
    message?: string;
    totalMembers?: number;
    unlocked?: boolean;
  } {
    if (new Date(group.expires_at).getTime() < Date.now()) {
      return { success: false, error: 'expired', message: 'Group code expired.' };
    }

    if (group.host_id === userId) {
      return { success: false, error: 'host_self_join', message: 'You are the host of this group.' };
    }

    const candidateHash = hashToken(inputCode, 'group-salt');
    if (group.code_hash !== candidateHash) {
      return { success: false, error: 'invalid_code', message: 'Invalid group code.' };
    }

    const currentMembers = new Set(group.members);
    currentMembers.add(userId);

    const totalCount = 1 + currentMembers.size; // host + members

    return {
      success: true,
      totalMembers: totalCount,
      unlocked: totalCount >= 3,
      message:
        totalCount >= 3
          ? 'Group unlocked! 3+ members gathered in person.'
          : `Joined group (${totalCount}/3 needed).`,
    };
  }
}
