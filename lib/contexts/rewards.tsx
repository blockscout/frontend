import { useBoolean } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import type {
  RewardsUserBalancesResponse, RewardsUserDailyCheckResponse,
  RewardsNonceResponse, RewardsCheckUserResponse,
  RewardsLoginResponse, RewardsCheckRefCodeResponse,
  RewardsUserDailyClaimResponse, RewardsUserReferralsResponse,
  RewardsConfigResponse,
} from 'types/api/rewards';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import decodeJWT from 'lib/decodeJWT';
import useToast from 'lib/hooks/useToast';
import getQueryParamString from 'lib/router/getQueryParamString';
import removeQueryParam from 'lib/router/removeQueryParam';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

type TRewardsContext = {
  balancesQuery: UseQueryResult<RewardsUserBalancesResponse, ResourceError<unknown>>;
  dailyRewardQuery: UseQueryResult<RewardsUserDailyCheckResponse, ResourceError<unknown>>;
  referralsQuery: UseQueryResult<RewardsUserReferralsResponse, ResourceError<unknown>>;
  rewardsConfigQuery: UseQueryResult<RewardsConfigResponse, ResourceError<unknown>>;
  apiToken: string | undefined;
  isInitialized: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (refCode: string) => Promise<{ isNewUser?: boolean; invalidRefCodeError?: boolean }>;
  claim: () => Promise<void>;
}

const createDefaultQueryResult = <TData, TError>() =>
  ({ data: undefined, isLoading: false, refetch: () => {} } as UseQueryResult<TData, TError>);

const RewardsContext = createContext<TRewardsContext>({
  balancesQuery: createDefaultQueryResult<RewardsUserBalancesResponse, ResourceError<unknown>>(),
  dailyRewardQuery: createDefaultQueryResult<RewardsUserDailyCheckResponse, ResourceError<unknown>>(),
  referralsQuery: createDefaultQueryResult<RewardsUserReferralsResponse, ResourceError<unknown>>(),
  rewardsConfigQuery: createDefaultQueryResult<RewardsConfigResponse, ResourceError<unknown>>(),
  apiToken: undefined,
  isInitialized: false,
  isLoginModalOpen: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  login: async() => ({}),
  claim: async() => {},
});

// Message to sign for the rewards program
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

// Get the registered address from the JWT token
function getRegisteredAddress(token: string) {
  const decodedToken = decodeJWT(token);
  return decodedToken?.payload.sub;
}

type Props = {
  children: React.ReactNode;
}

export function RewardsContextProvider({ children }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();
  const toast = useToast();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const profileQuery = useProfileQuery();

  const [ isLoginModalOpen, setIsLoginModalOpen ] = useBoolean(false);
  const [ isInitialized, setIsInitialized ] = useBoolean(false);
  const [ apiToken, setApiToken ] = React.useState<string | undefined>();

  // Initialize state with the API token from cookies
  useEffect(() => {
    if (!profileQuery.isLoading) {
      const token = cookies.get(cookies.NAMES.REWARDS_API_TOKEN);
      const registeredAddress = getRegisteredAddress(token || '');
      if (registeredAddress === profileQuery.data?.address_hash) {
        setApiToken(token);
      }
      setIsInitialized.on();
    }
  }, [ setIsInitialized, profileQuery ]);

  // Save the API token to cookies and state
  const saveApiToken = useCallback((token: string | undefined) => {
    cookies.set(cookies.NAMES.REWARDS_API_TOKEN, token || '');
    setApiToken(token);
  }, []);

  const [ queryOptions, fetchParams ] = useMemo(() => [
    { enabled: Boolean(apiToken) && config.features.rewards.isEnabled },
    { headers: { Authorization: `Bearer ${ apiToken }` } },
  ], [ apiToken ]);

  const balancesQuery = useApiQuery('rewards_user_balances', { queryOptions, fetchParams });
  const dailyRewardQuery = useApiQuery('rewards_user_daily_check', { queryOptions, fetchParams });
  const referralsQuery = useApiQuery('rewards_user_referrals', { queryOptions, fetchParams });
  const rewardsConfigQuery = useApiQuery('rewards_config', { queryOptions });

  // Reset queries when the API token is removed
  useEffect(() => {
    if (isInitialized && !apiToken) {
      queryClient.resetQueries({ queryKey: getResourceKey('rewards_user_balances'), exact: true });
      queryClient.resetQueries({ queryKey: getResourceKey('rewards_user_daily_check'), exact: true });
      queryClient.resetQueries({ queryKey: getResourceKey('rewards_user_referrals'), exact: true });
    }
  }, [ isInitialized, apiToken, queryClient ]);

  // Handle 401 error
  useEffect(() => {
    if (apiToken && balancesQuery.error?.status === 401) {
      saveApiToken(undefined);
    }
  }, [ balancesQuery.error, apiToken, saveApiToken ]);

  // Check if the profile address is the same as the registered address
  useEffect(() => {
    const registeredAddress = getRegisteredAddress(apiToken || '');
    if (registeredAddress && !profileQuery.isLoading && profileQuery.data?.address_hash !== registeredAddress) {
      setApiToken(undefined);
    }
  }, [ apiToken, profileQuery, setApiToken ]);

  // Handle referral code in the URL
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

  const errorToast = useCallback((error: ResourceError<{ message: string }>) => {
    toast({
      position: 'top-right',
      title: 'Error',
      description: error?.payload?.message || 'Something went wrong. Try again later.',
      status: 'error',
      variant: 'subtle',
      isClosable: true,
    });
  }, [ toast ]);

  // Login to the rewards program
  const login = useCallback(async(refCode: string) => {
    try {
      const [ nonceResponse, userResponse, checkCodeResponse ] = await Promise.all([
        apiFetch('rewards_nonce') as Promise<RewardsNonceResponse>,
        apiFetch('rewards_check_user', { pathParams: { address } }) as Promise<RewardsCheckUserResponse>,
        refCode ?
          apiFetch('rewards_check_ref_code', { pathParams: { code: refCode } }) as Promise<RewardsCheckRefCodeResponse> :
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
      const loginResponse = await apiFetch('rewards_login', {
        fetchParams: {
          method: 'POST',
          body: {
            nonce: nonceResponse.nonce,
            message,
            signature,
          },
        },
      }) as RewardsLoginResponse;
      if (!('created' in loginResponse)) {
        throw loginResponse;
      }
      saveApiToken(loginResponse.token);
      return { isNewUser: loginResponse.created };
    } catch (_error) {
      errorToast(_error as ResourceError<{ message: string }>);
      throw _error;
    }
  }, [ apiFetch, address, signMessageAsync, errorToast, saveApiToken ]);

  // Claim daily reward
  const claim = useCallback(async() => {
    try {
      const claimResponse = await apiFetch('rewards_user_daily_claim', {
        fetchParams: {
          method: 'POST',
          ...fetchParams,
        },
      }) as RewardsUserDailyClaimResponse;
      if (!('daily_reward' in claimResponse)) {
        throw claimResponse;
      }
    } catch (_error) {
      errorToast(_error as ResourceError<{ message: string }>);
      throw _error;
    }
  }, [ apiFetch, errorToast, fetchParams ]);

  const value = useMemo(() => ({
    balancesQuery,
    dailyRewardQuery,
    referralsQuery,
    rewardsConfigQuery,
    apiToken,
    isInitialized,
    isLoginModalOpen,
    openLoginModal: setIsLoginModalOpen.on,
    closeLoginModal: setIsLoginModalOpen.off,
    login,
    claim,
  }), [
    isLoginModalOpen, setIsLoginModalOpen, balancesQuery, dailyRewardQuery,
    apiToken, login, claim, referralsQuery, rewardsConfigQuery, isInitialized,
  ]);

  return (
    <RewardsContext.Provider value={ value }>
      { children }
    </RewardsContext.Provider>
  );
}

export function useRewardsContext() {
  return useContext(RewardsContext);
}
