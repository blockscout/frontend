import type { ApiResource } from '../types';
import type * as rewards from '@blockscout/points-types';

// TODO @tom2drum remove prefix from resource names
export const REWARDS_API_RESOURCES = {
  rewards_config: {
    path: '/api/v1/config',
  },
  rewards_check_ref_code: {
    path: '/api/v1/auth/code/:code',
    pathParams: [ 'code' as const ],
  },
  rewards_nonce: {
    path: '/api/v1/auth/nonce',
  },
  rewards_check_user: {
    path: '/api/v1/auth/user/:address',
    pathParams: [ 'address' as const ],
  },
  rewards_login: {
    path: '/api/v1/auth/login',
  },
  rewards_logout: {
    path: '/api/v1/auth/logout',
  },
  rewards_user_balances: {
    path: '/api/v1/user/balances',
  },
  rewards_user_daily_check: {
    path: '/api/v1/user/daily/check',
  },
  rewards_user_daily_claim: {
    path: '/api/v1/user/daily/claim',
  },
  rewards_user_referrals: {
    path: '/api/v1/user/referrals',
  },
  rewards_user_check_activity_pass: {
    path: '/api/v1/activity/check-pass',
    filterFields: [ 'address' as const ],
  },
  rewards_user_activity: {
    path: '/api/v1/user/activity/rewards',
  },
  rewards_user_activity_track_tx: {
    path: '/api/v1/user/activity/track/transaction',
  },
  rewards_user_activity_track_tx_confirm: {
    path: '/api/v1/activity/track/transaction/confirm',
  },
  rewards_user_activity_track_contract: {
    path: '/api/v1/user/activity/track/contract',
  },
  rewards_user_activity_track_contract_confirm: {
    path: '/api/v1/activity/track/contract/confirm',
  },
  rewards_user_activity_track_usage: {
    path: '/api/v1/user/activity/track/usage',
  },
  rewards_instances: {
    path: '/api/v1/instances',
  },
} satisfies Record<string, ApiResource>;

export type RewardsApiResourceName = `rewards:${ keyof typeof REWARDS_API_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type RewardsApiResourcePayload<R extends RewardsApiResourceName> =
R extends 'rewards:rewards_config' ? rewards.GetConfigResponse :
R extends 'rewards:rewards_check_ref_code' ? rewards.AuthCodeResponse :
R extends 'rewards:rewards_nonce' ? rewards.AuthNonceResponse :
R extends 'rewards:rewards_check_user' ? rewards.AuthUserResponse :
R extends 'rewards:rewards_login' ? rewards.AuthLoginResponse :
R extends 'rewards:rewards_user_balances' ? rewards.GetUserBalancesResponse :
R extends 'rewards:rewards_user_daily_check' ? rewards.DailyRewardCheckResponse :
R extends 'rewards:rewards_user_daily_claim' ? rewards.DailyRewardClaimResponse :
R extends 'rewards:rewards_user_referrals' ? rewards.GetReferralDataResponse :
R extends 'rewards:rewards_user_check_activity_pass' ? rewards.CheckActivityPassResponse :
R extends 'rewards:rewards_user_activity' ? rewards.GetActivityRewardsResponse :
R extends 'rewards:rewards_user_activity_track_tx' ? rewards.PreSubmitTransactionResponse :
R extends 'rewards:rewards_user_activity_track_contract' ? rewards.PreVerifyContractResponse :
R extends 'rewards:rewards_instances' ? rewards.GetInstancesResponse :
never;
/* eslint-enable @stylistic/indent */
