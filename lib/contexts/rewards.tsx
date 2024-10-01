import { useBoolean } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

import type { RewardsUserBalancesResponse, RewardsUserDailyCheckResponse } from 'types/api/rewards';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';

type Props = {
  children: React.ReactNode;
}

type TRewardsContext = {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  balance: RewardsUserBalancesResponse | undefined;
  refetchBalance: () => void;
  dailyReward: RewardsUserDailyCheckResponse | undefined;
  refetchDailyReward: () => void;
  isLogedIn: boolean;
}

const RewardsContext = createContext<TRewardsContext>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  balance: undefined,
  refetchBalance: () => {},
  dailyReward: undefined,
  refetchDailyReward: () => {},
  isLogedIn: false,
});

export function RewardsContextProvider({ children }: Props) {
  const apiToken = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
  const apiQueryOptions = {
    queryOptions: {
      enabled: Boolean(apiToken) && config.features.rewards.isEnabled,
    },
    fetchParams: {
      headers: {
        Authorization: `Bearer ${ apiToken }`,
      },
    },
  };

  const [ isLoginModalOpen, setIsLoginModalOpen ] = useBoolean(false);

  const balancesQuery = useApiQuery('rewards_user_balances', apiQueryOptions);
  const dailyRewardQuery = useApiQuery('rewards_user_daily_check', apiQueryOptions);

  useEffect(() => {
    if (apiToken && balancesQuery.error?.status === 401) {
      cookies.set(cookies.NAMES.REWARDS_API_TOKEN, '');
    }
  }, [ balancesQuery.error, apiToken ]);

  const value = useMemo(() => ({
    isLoginModalOpen,
    openLoginModal: setIsLoginModalOpen.on,
    closeLoginModal: setIsLoginModalOpen.off,
    balance: balancesQuery.data,
    refetchBalance: balancesQuery.refetch,
    dailyReward: dailyRewardQuery.data,
    refetchDailyReward: dailyRewardQuery.refetch,
    isLogedIn: Boolean(apiToken),
  }), [ isLoginModalOpen, setIsLoginModalOpen, balancesQuery, dailyRewardQuery, apiToken ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}
