import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

export default function useReferrals() {
  return useApiQuery('rewards_config', {
    queryOptions: {
      enabled: config.features.rewards.isEnabled,
    },
  });
}
