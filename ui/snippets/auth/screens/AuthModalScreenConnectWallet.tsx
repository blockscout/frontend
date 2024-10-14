import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { ScreenSuccess } from '../types';
import type { UserInfo } from 'types/api/account';

import type * as mixpanel from 'lib/mixpanel';

import useSignInWithWallet from '../useSignInWithWallet';

interface Props {
  onSuccess: (screen: ScreenSuccess) => void;
  onError: (isAuth?: boolean) => void;
  isAuth?: boolean;
  source?: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_CONNECT>['Source'];
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError, isAuth, source }: Props) => {
  const isStartedRef = React.useRef(false);

  const handleSignInSuccess = React.useCallback(({ address, profile }: { address: string; profile: UserInfo }) => {
    onSuccess({ type: 'success_wallet', address, isAuth, profile });
  }, [ onSuccess, isAuth ]);

  const handleSignInError = React.useCallback(() => {
    onError(isAuth);
  }, [ onError, isAuth ]);

  const { start } = useSignInWithWallet({ onSuccess: handleSignInSuccess, onError: handleSignInError, source, isAuth });

  React.useEffect(() => {
    if (!isStartedRef.current) {
      isStartedRef.current = true;
      start();
    }
  }, [ start ]);

  return <Center h="100px"><Spinner/></Center>;
};

export default React.memo(AuthModalScreenConnectWallet);
