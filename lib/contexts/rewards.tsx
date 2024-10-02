import { useBoolean } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

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
  apiToken: string | undefined;
  saveApiToken: (token: string) => void;
}

const RewardsContext = createContext<TRewardsContext>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  balance: undefined,
  refetchBalance: () => {},
  dailyReward: undefined,
  refetchDailyReward: () => {},
  apiToken: undefined,
  saveApiToken: () => {},
});

export function RewardsContextProvider({ children }: Props) {
  const [ isLoginModalOpen, setIsLoginModalOpen ] = useBoolean(false);
  const [ apiToken, setApiToken ] = React.useState<string | undefined>(cookies.get(cookies.NAMES.REWARDS_API_TOKEN));

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
  const balancesQuery = useApiQuery('rewards_user_balances', apiQueryOptions);
  const dailyRewardQuery = useApiQuery('rewards_user_daily_check', apiQueryOptions);

  const saveApiToken = useCallback((token: string) => {
    cookies.set(cookies.NAMES.REWARDS_API_TOKEN, token);
    setApiToken(token);
  }, []);

  useEffect(() => {
    if (apiToken && balancesQuery.error?.status === 401) {
      saveApiToken('');
    }
  }, [ balancesQuery.error, apiToken, saveApiToken ]);

  const value = useMemo(() => ({
    isLoginModalOpen,
    openLoginModal: setIsLoginModalOpen.on,
    closeLoginModal: setIsLoginModalOpen.off,
    balance: balancesQuery.data,
    refetchBalance: balancesQuery.refetch,
    dailyReward: dailyRewardQuery.data,
    refetchDailyReward: dailyRewardQuery.refetch,
    apiToken,
    saveApiToken,
  }), [ isLoginModalOpen, setIsLoginModalOpen, balancesQuery, dailyRewardQuery, apiToken, saveApiToken ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}
