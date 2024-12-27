import type { RewardsUserDailyCheckResponse } from 'types/api/rewards';

export const base: RewardsUserDailyCheckResponse = {
  available: true,
  daily_reward: '10',
  streak_reward: '10',
  pending_referral_rewards: '0',
  total_reward: '20',
  date: '',
  reset_at: '',
  streak: '6',
};
