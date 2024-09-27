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
  balances: RewardsUserBalancesResponse | undefined;
  dailyReward: RewardsUserDailyCheckResponse | undefined;
  isLogedIn: boolean;
}

const RewardsContext = createContext<TRewardsContext>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  balances: undefined,
  dailyReward: undefined,
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
    balances: balancesQuery.data,
    dailyReward: dailyRewardQuery.data,
    isLogedIn: Boolean(apiToken),
  }), [ isLoginModalOpen, setIsLoginModalOpen, balancesQuery.data, dailyRewardQuery.data, apiToken ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}
