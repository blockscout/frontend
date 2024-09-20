import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { ScreenSuccess } from '../types';

import useSignInWithWallet from '../useSignInWithWallet';

interface Props {
  onSuccess: (screen: ScreenSuccess) => void;
  onError: (isAuth?: boolean) => void;
  isAuth?: boolean;
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError, isAuth }: Props) => {
  const isStartedRef = React.useRef(false);

  const handleSignInSuccess = React.useCallback(({ address }: { address: string }) => {
    onSuccess({ type: 'success_wallet', address, isAuth });
  }, [ onSuccess, isAuth ]);

  const handleSignInError = React.useCallback(() => {
    onError(isAuth);
  }, [ onError, isAuth ]);

  const { start } = useSignInWithWallet({ onSuccess: handleSignInSuccess, onError: handleSignInError });

  React.useEffect(() => {
    if (!isStartedRef.current) {
      isStartedRef.current = true;
      start();
    }
  }, [ start ]);

  return <Center h="100px"><Spinner/></Center>;
};

export default React.memo(AuthModalScreenConnectWallet);
