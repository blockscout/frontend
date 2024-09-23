import { Alert, Button, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import useWeb3Wallet from 'lib/web3/useWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import useSignInWithWallet from 'ui/snippets/auth/useSignInWithWallet';

interface Props {
  isLoading?: boolean;
}

const ContractConnectWallet = ({ isLoading }: Props) => {
  const signInWithWallet = useSignInWithWallet({ source: 'Smart contracts' });
  const isAuth = useIsAuth();
  const web3Wallet = useWeb3Wallet({ source: 'Smart contracts' });
  const isMobile = useIsMobile();

  const shouldSignIn = config.features.account.isEnabled && !isAuth;

  const handleConnectClick = React.useCallback(() => {
    if (shouldSignIn) {
      signInWithWallet.start();
    } else {
      web3Wallet.connect();
    }
  }, [ signInWithWallet, web3Wallet, shouldSignIn ]);

  const content = (() => {
    if (!web3Wallet.isConnected) {
      return (
        <>
          <span>Disconnected</span>
          <Button
            ml={ 3 }
            onClick={ handleConnectClick }
            size="sm"
            variant="outline"
            isLoading={ shouldSignIn ? signInWithWallet.isPending : web3Wallet.isOpen }
            loadingText="Connect wallet"
          >
            Connect wallet
          </Button>
        </>
      );
    }

    return (
      <Flex columnGap={ 3 } rowGap={ 3 } alignItems={{ base: 'flex-start', lg: 'center' }} flexDir={{ base: 'column', lg: 'row' }}>
        <Flex alignItems="center">
          <span>Connected to </span>
          <AddressEntity
            address={{ hash: web3Wallet.address || '' }}
            truncation={ isMobile ? 'constant' : 'dynamic' }
            fontWeight={ 600 }
            ml={ 2 }
          />
        </Flex>
        <Button onClick={ web3Wallet.disconnect } size="sm" variant="outline">Disconnect</Button>
      </Flex>
    );
  })();

  return (
    <Skeleton isLoaded={ !isLoading } mb={ 6 }>
      <Alert status={ web3Wallet.address ? 'success' : 'warning' }>
        { content }
      </Alert>
    </Skeleton>
  );
};

const Fallback = () => null;

export default config.features.blockchainInteraction.isEnabled ? ContractConnectWallet : Fallback;
