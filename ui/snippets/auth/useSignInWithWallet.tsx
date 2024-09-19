import { useWeb3Modal } from '@web3modal/wagmi/react';
import React from 'react';
import { useSignMessage } from 'wagmi';

import useApiFetch from 'lib/api/useApiFetch';
import getErrorMessage from 'lib/errors/getErrorMessage';
import useToast from 'lib/hooks/useToast';
import useAccount from 'lib/web3/useAccount';

interface Props {
  onSuccess?: ({ address }: { address: string }) => void;
  onError?: () => void;
}

export default function useSignInWithWallet({ onSuccess, onError }: Props) {
  const [ isPending, setIsPending ] = React.useState(false);
  const isConnectingWalletRef = React.useRef(false);

  const apiFetch = useApiFetch();
  const toast = useToast();
  const web3Modal = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

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
      onSuccess?.({ address });
    } catch (error) {
      // TODO @tom2drum show better error message
      onError?.();
      toast({
        status: 'error',
        title: 'Error',
        description: getErrorMessage(error) || 'Something went wrong',
      });
    } finally {
      setIsPending(false);
    }
  }, [ apiFetch, onError, onSuccess, signMessageAsync, toast ]);

  const start = React.useCallback(() => {
    setIsPending(true);
    if (address) {
      proceedToAuth(address);
    } else {
      isConnectingWalletRef.current = true;
      web3Modal.open();
    }
  }, [ address, proceedToAuth, web3Modal ]);

  React.useEffect(() => {
    if (address && isConnectingWalletRef.current) {
      isConnectingWalletRef.current = false;
      proceedToAuth(address);
    }
  }, [ address, isConnected, proceedToAuth ]);

  return React.useMemo(() => ({ start, isPending }), [ start, isPending ]);
}
