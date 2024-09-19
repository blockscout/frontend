import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { Screen } from '../types';

import useSignInWithWallet from './useSignInWithWallet';

interface Props {
  onSuccess: (screen: Screen) => void;
  onError: () => void;
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError }: Props) => {
  const isStartedRef = React.useRef(false);

  const handleSignInSuccess = React.useCallback(({ address }: { address: string }) => {
    onSuccess({ type: 'success_created_wallet', address });
  }, [ onSuccess ]);

  const handleSignInError = React.useCallback(() => {
    onError();
  }, [ onError ]);

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
