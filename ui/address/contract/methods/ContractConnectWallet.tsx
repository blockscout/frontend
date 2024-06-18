import { Alert, Button, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useWallet from 'ui/snippets/walletMenu/useWallet';

interface Props {
  isLoading?: boolean;
}

const ContractConnectWallet = ({ isLoading }: Props) => {
  const { isModalOpening, isModalOpen, connect, disconnect, address, isWalletConnected } = useWallet({ source: 'Smart contracts' });
  const isMobile = useIsMobile();

  const content = (() => {
    if (!isWalletConnected) {
      return (
        <>
          <span>Disconnected</span>
          <Button
            ml={ 3 }
            onClick={ connect }
            size="sm"
            variant="outline"
            isLoading={ isModalOpening || isModalOpen }
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
            address={{ hash: address }}
            truncation={ isMobile ? 'constant' : 'dynamic' }
            fontWeight={ 600 }
            ml={ 2 }
          />
        </Flex>
        <Button onClick={ disconnect } size="sm" variant="outline">Disconnect</Button>
      </Flex>
    );
  })();

  return (
    <Skeleton isLoaded={ !isLoading } mb={ 6 }>
      <Alert status={ address ? 'success' : 'warning' }>
        { content }
      </Alert>
    </Skeleton>
  );
};

const Fallback = () => null;

export default config.features.blockchainInteraction.isEnabled ? ContractConnectWallet : Fallback;
