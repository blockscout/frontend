export type RewardsConfigResponse = {
  rewards: {
    registration: string;
    registration_with_referral: string;
    daily_claim: string;
    referral_share: string;
  };
};

export type RewardsCheckRefCodeResponse = {
  valid: boolean;
};

export type RewardsNonceResponse = {
  nonce: string;
};

export type RewardsCheckUserResponse = {
  exists: boolean;
};

export type RewardsLoginResponse = {
  created: boolean;
  token: string;
};

export type RewardsUserBalancesResponse = {
  total: string;
  staked: string;
  unstaked: string;
  total_staking_rewards: string;
  total_referral_rewards: string;
  pending_referral_rewards: string;
};

export type RewardsUserDailyCheckResponse = {
  available: boolean;
  daily_reward: string;
  pending_referral_rewards: string;
  date: string;
  reset_at: string;
};

export type RewardsUserDailyClaimResponse = {
  daily_reward: string;
  pending_referral_rewards: string;
};

export type RewardsUserReferralsResponse = {
  code: string;
  link: string;
  referrals: string;
};
