export type RewardsConfigResponse = {
  rewards: {
    registration: string;
    registration_with_referral: string;
    daily_claim: string;
    referral_share: string;
  };
  auth: {
    shared_siwe_login: boolean;
  };
};

export type RewardsCheckRefCodeResponse = {
  valid: boolean;
  is_custom: boolean;
  reward: string | null;
};

export type RewardsNonceResponse = {
  nonce: string;
  merits_login_nonce?: string;
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
  streak_reward: string;
  pending_referral_rewards: string;
  total_reward: string;
  date: string;
  reset_at: string;
  streak: string;
};

export type RewardsUserDailyClaimResponse = {
  daily_reward: string;
  streak_reward: string;
  pending_referral_rewards: string;
  total_reward: string;
  streak: string;
};

export type RewardsUserReferralsResponse = {
  code: string;
  link: string;
  referrals: string;
};

type UserActivity = {
  date: string;
  end_date: string;
  activity: string;
  amount: string | null;
  percentile: string | null;
  is_pending: boolean;
};

export type RewardsUserActivityResponse = {
  items: Array<UserActivity>;
  last_week: Array<UserActivity>;
};

export type RewardsInstance = {
  chain_id: string;
  name: string;
  domain: string;
  details: {
    icon_url: string;
    is_mainnet: boolean;
  };
};

export type RewardsInstancesResponse = {
  items: Array<RewardsInstance>;
};

export type RewardsUserActivityTrackTxResponse = {
  token: string;
};

export type RewardsUserActivityTrackContractResponse = {
  token: string;
};

export type RewardsUserCheckActivityPassResponse = {
  is_valid: boolean;
};
