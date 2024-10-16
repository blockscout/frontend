import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';

export default function useRewardsConfig() {
  return useApiQuery('rewards_config', {
    queryOptions: {
      enabled: config.features.rewards.isEnabled,
    },
  });
}
