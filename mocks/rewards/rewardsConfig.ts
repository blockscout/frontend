import type { RewardsConfigResponse } from 'types/api/rewards';

export const base: RewardsConfigResponse = {
  rewards: {
    registration: '100',
    registration_with_referral: '200',
    daily_claim: '10',
    referral_share: '0.1',
  },
};
