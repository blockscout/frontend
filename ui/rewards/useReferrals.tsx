import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';

export default function useReferrals() {
  const apiToken = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
  return useApiQuery('rewards_user_referrals', {
    queryOptions: {
      enabled: Boolean(apiToken) && config.features.rewards.isEnabled,
    },
    fetchParams: {
      headers: {
        Authorization: `Bearer ${ apiToken }`,
      },
    },
  });
}
