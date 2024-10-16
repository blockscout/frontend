import { useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import type {
  RewardsUserBalancesResponse, RewardsUserDailyCheckResponse,
  RewardsNonceResponse, RewardsCheckUserResponse,
  RewardsLoginResponse, RewardsCheckRefCodeResponse,
} from 'types/api/rewards';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import useToast from 'lib/hooks/useToast';
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
  login: (refCode: string) => Promise<{ isNewUser?: boolean; invalidRefCodeError?: boolean }>;
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
  login: async() => ({}),
});

function getMessageToSign(address: string, nonce: string, isLogin?: boolean, refCode?: string) {
  const signInText = 'Sign-In for the Blockscout points program.';
  const signUpText = 'Sign-Up for the Blockscout points program. I accept Terms of Service: https://points.blockscout.com/tos. I love capybaras.';
  const referralText = refCode ? ` Referral code: ${ refCode }` : '';
  const body = isLogin ? signInText : signUpText + referralText;
  return [
    `${ window.location.hostname } wants you to sign in with your Ethereum account:`,
    address,
    '',
    body,
    '',
    `URI: ${ window.location.origin }`,
    'Version: 1',
    `Chain ID: ${ config.chain.id }`,
    `Nonce: ${ nonce }`,
    `Issued At: ${ new Date().toISOString() }`,
    `Expiration Time: ${ new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() }`,
  ].join('\n');
}

export function RewardsContextProvider({ children }: Props) {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const toast = useToast();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
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

  const login = useCallback(async(refCode: string) => {
    try {
      const [ nonceResponse, userResponse, checkCodeResponse ] = await Promise.all([
        apiFetch<'rewards_nonce', RewardsNonceResponse>('rewards_nonce'),
        apiFetch<'rewards_check_user', RewardsCheckUserResponse>('rewards_check_user', { pathParams: { address } }),
        refCode ?
          apiFetch<'rewards_check_ref_code', RewardsCheckRefCodeResponse>('rewards_check_ref_code', { pathParams: { code: refCode } }) :
          Promise.resolve({ valid: true }),
      ]);
      if (!address || !('nonce' in nonceResponse) || !('exists' in userResponse) || !('valid' in checkCodeResponse)) {
        throw new Error();
      }
      if (!checkCodeResponse.valid) {
        return { invalidRefCodeError: true };
      }
      const message = getMessageToSign(address, nonceResponse.nonce, userResponse.exists, refCode);
      const signature = await signMessageAsync({ message });
      const loginResponse = await apiFetch<'rewards_login', RewardsLoginResponse>('rewards_login', {
        fetchParams: {
          method: 'POST',
          body: {
            nonce: nonceResponse.nonce,
            message,
            signature,
          },
        },
      });
      if (!('created' in loginResponse)) {
        throw loginResponse;
      }
      saveApiToken(loginResponse.token);
      return { isNewUser: loginResponse.created };
    } catch (_error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (_error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
      throw _error;
    }
  }, [ apiFetch, address, signMessageAsync, toast, saveApiToken ]);

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
    login,
  }), [ isLoginModalOpen, setIsLoginModalOpen, balancesQuery, dailyRewardQuery, apiToken, login ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}
