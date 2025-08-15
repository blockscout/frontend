import { useMemo } from 'react';

import type { GetAvailableBadgesResponse } from '@blockscout/points-types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';

const feature = config.features.rewards;

const STUB_BADGES: GetAvailableBadgesResponse = {
  items: [
    {
      chain_id: '1868',
      address: '0x3eBD84889949502Ef6173DF97d9Fec07f830AabB',
      requirements: {
        streak: '50',
      },
      is_whitelisted: false,
      is_qualified: false,
    },
    {
      chain_id: '1868',
      address: '0x3eBD84889949502Ef6173DF97d9Fec07f830AabB',
      requirements: {
        streak: '100',
      },
      is_whitelisted: false,
      is_qualified: false,
    },
    {
      chain_id: '1868',
      address: '0x3eBD84889949502Ef6173DF97d9Fec07f830AabB',
      requirements: {
        streak: '150',
      },
      is_whitelisted: false,
      is_qualified: false,
    },
  ],
};

export default function useStreakBadges() {
  const { apiToken, dailyRewardQuery } = useRewardsContext();

  const badgesQuery = useApiQuery<'rewards:user_badges', unknown, GetAvailableBadgesResponse>('rewards:user_badges', {
    queryOptions: {
      enabled: feature.isEnabled && Boolean(apiToken),
      select: (/* data */) => {
        // return data?.items
        //   .sort((a, b) => Number(a.requirements?.streak || 0) - Number(b.requirements?.streak || 0))
        //   .slice(0, 3);
        return STUB_BADGES;
      },
    },
    fetchParams: { headers: { Authorization: `Bearer ${ apiToken }` } },
  });

  const daysToNextAchievement = useMemo(() => {
    const items = badgesQuery.data?.items ?? [];
    if (!items.length) {
      return undefined;
    }

    const currentStreak = Number(dailyRewardQuery.data?.streak || 0);
    if (Number.isNaN(currentStreak)) {
      return undefined;
    }

    const sorted = [ ...items ].sort((a, b) => Number(a.requirements?.streak || 0) - Number(b.requirements?.streak || 0));
    const next = sorted.find((b) => !(b.is_qualified || b.is_whitelisted));
    if (!next) {
      return undefined;
    }
    const target = Number(next.requirements?.streak || 0);
    const diff = target - currentStreak;
    return diff > 0 ? diff : 0;
  }, [ badgesQuery.data, dailyRewardQuery.data?.streak ]);

  return {
    badgesQuery,
    daysToNextAchievement,
    isLoading: badgesQuery.isPending,
  };
}
