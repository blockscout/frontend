import { useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';

import type { RewardsUserBalancesResponse, RewardsUserDailyCheckResponse } from 'types/api/rewards';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';

type Props = {
  children: React.ReactNode;
}

type TRewardsContext = {
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  balance: RewardsUserBalancesResponse | undefined;
  isBalanceLoading: boolean;
  refetchBalance: () => void;
  dailyReward: RewardsUserDailyCheckResponse | undefined;
  isDailyRewardLoading: boolean;
  refetchDailyReward: () => void;
  apiToken: string | undefined;
  saveApiToken: (token: string) => void;
}

const RewardsContext = createContext<TRewardsContext>({
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  balance: undefined,
  isBalanceLoading: false,
  refetchBalance: () => {},
  dailyReward: undefined,
  isDailyRewardLoading: false,
  refetchDailyReward: () => {},
  apiToken: undefined,
  saveApiToken: () => {},
});

export function RewardsContextProvider({ children }: Props) {
  const router = useRouter();
  const [ isLoginModalOpen, setIsLoginModalOpen ] = useBoolean(false);
  const [ isInitialized, setIsInitialized ] = useBoolean(false);
  const [ apiToken, setApiToken ] = React.useState<string | undefined>();

  useEffect(() => {
    const token = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
    if (token) {
      setApiToken(token);
    }
    setIsInitialized.on();
  }, [ setIsInitialized ]);

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

  useEffect(() => {
    const refCode = getQueryParamString(router.query.ref);
    if (refCode && isInitialized) {
      cookies.set(cookies.NAMES.REWARDS_REFERRAL_CODE, refCode);
      removeQueryParam(router, 'ref');
      if (!apiToken) {
        setIsLoginModalOpen.on();
      }
    }
  }, [ router, apiToken, isInitialized, setIsLoginModalOpen ]);

  const value = useMemo(() => ({
    isLoginModalOpen,
    openLoginModal: setIsLoginModalOpen.on,
    closeLoginModal: setIsLoginModalOpen.off,
    balance: balancesQuery.data,
    isBalanceLoading: balancesQuery.isLoading,
    refetchBalance: balancesQuery.refetch,
    dailyReward: dailyRewardQuery.data,
    isDailyRewardLoading: dailyRewardQuery.isLoading,
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
