// SPDX-License-Identifier: LicenseRef-Blockscout

import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { ScreenSuccess } from '../types';
import type { UserInfo } from 'client/features/account/types/api';

import useSignInWithWallet from 'client/features/account/hooks/useSignInWithWallet';

import type * as mixpanel from 'client/shared/analytics/mixpanel';

import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

interface Props {
  onSuccess: (screen: ScreenSuccess) => void;
  onError: (isAuth?: boolean) => void;
  isAuth?: boolean;
  source?: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
  loginToRewards?: boolean;
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError, isAuth, source, loginToRewards }: Props) => {
  const isStartedRef = React.useRef(false);
  const recaptcha = useReCaptcha();

  const handleSignInSuccess = React.useCallback(({ address, profile, rewardsToken }: { address: string; profile: UserInfo; rewardsToken?: string }) => {
    onSuccess({ type: 'success_wallet', address, isAuth, profile, rewardsToken });
  }, [ onSuccess, isAuth ]);

  const handleSignInError = React.useCallback(() => {
    onError(isAuth);
  }, [ onError, isAuth ]);

  const { start } = useSignInWithWallet({
    onSuccess: handleSignInSuccess,
    onError: handleSignInError,
    source,
    isAuth,
    fetchProtectedResource: recaptcha.fetchProtectedResource,
    loginToRewards,
  });

  React.useEffect(() => {
    if (!isStartedRef.current) {
      isStartedRef.current = true;
      start();
    }
  }, [ start ]);

  return (
    <Center minH="100px" flexDir="column">
      { !recaptcha.isInitError && <Spinner size="xl"/> }
      <ReCaptcha { ...recaptcha }/>
    </Center>
  );
};

export default React.memo(AuthModalScreenConnectWallet);
