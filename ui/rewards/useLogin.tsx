import { useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import type {
  RewardsNonceResponse, RewardsCheckUserResponse,
  RewardsLoginResponse, RewardsCheckRefCodeResponse,
} from 'types/api/rewards';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import * as cookies from 'lib/cookies';
import useToast from 'lib/hooks/useToast';

function getMessageToSign(address: string, nonce: string, isLogin?: boolean, refCode?: string) {
  const signInText = 'Sign-In for the Blockscout points program.';
  const signUpText = 'Sign-Up for the Blockscout points program. I accept Terms of Service: https://points.blockscout.com/tos. I love capybaras.';
  const referralText = refCode ? ` Referral code: ${ refCode }` : '';
  const body = isLogin ? signInText : signUpText + referralText;
  return [
    `${ /*window.location.hostname*/ 'blockscout.com' } wants you to sign in with your Ethereum account:`,
    address,
    '',
    body,
    '',
    `URI: ${ /*window.location.origin*/ 'https://blockscout.com' }`,
    'Version: 1',
    `Chain ID: ${ config.chain.id }`,
    `Nonce: ${ nonce }`,
    `Issued At: ${ new Date().toISOString() }`,
  ].join('\n');
}

export default function useLogin() {
  const apiFetch = useApiFetch();
  const toast = useToast();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  return useCallback(async(refCode: string) => {
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
      cookies.set(cookies.NAMES.REWARDS_API_TOKEN, loginResponse.token);
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
  }, [ apiFetch, address, signMessageAsync, toast ]);
}
