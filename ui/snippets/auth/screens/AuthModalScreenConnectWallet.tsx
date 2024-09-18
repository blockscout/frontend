import { Center, Spinner } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import React from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import type { Screen } from '../types';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useToast from 'lib/hooks/useToast';

interface Props {
  onSuccess: (screen: Screen) => void;
  onError: () => void;
}

const AuthModalScreenConnectWallet = ({ onSuccess, onError }: Props) => {
  const isSigningRef = React.useRef(false);

  const apiFetch = useApiFetch();
  const toast = useToast();
  const web3Modal = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  React.useEffect(() => {
    !isConnected && web3Modal.open();
  }, [ isConnected, web3Modal ]);

  const proceedToAuth = React.useCallback(async(address: string) => {
    try {
      const siweMessage = await apiFetch('auth_siwe_message', { queryParams: { address } }) as { siwe_message: string };
      const signature = await signMessageAsync({ message: siweMessage.siwe_message });
      await apiFetch('auth_siwe_verify', {
        fetchParams: {
          method: 'POST',
          body: { message: siweMessage.siwe_message, signature },
        },
      });
      onSuccess({ type: 'success_created_wallet', address });
    } catch (error) {
      // TODO @tom2drum show better error message
      onError();
      toast({
        status: 'error',
        title: 'Error',
        description: getErrorMessage(error) || 'Something went wrong',
      });
    }
  }, [ apiFetch, onError, onSuccess, signMessageAsync, toast ]);

  React.useEffect(() => {
    if (isConnected && address && !isSigningRef.current) {
      isSigningRef.current = true;
      proceedToAuth(address);
    }
  }, [ address, isConnected, proceedToAuth ]);

  return <Center h="100px"><Spinner/></Center>;
};

export default React.memo(AuthModalScreenConnectWallet);
