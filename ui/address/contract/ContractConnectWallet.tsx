import { Alert, Button, Flex } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

const ContractConnectWallet = () => {
  const { open, isOpen } = useWeb3Modal();
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const isMobile = useIsMobile();
  const [ isModalOpening, setIsModalOpening ] = React.useState(false);

  const handleConnect = React.useCallback(async() => {
    setIsModalOpening(true);
    await open();
    setIsModalOpening(false);
  }, [ open ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  const content = (() => {
    if (isDisconnected || !address) {
      return (
        <>
          <span>Disconnected</span>
          <Button
            ml={ 3 }
            onClick={ handleConnect }
            size="sm"
            variant="outline"
            isLoading={ isModalOpening || isOpen }
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
        <Button onClick={ handleDisconnect } size="sm" variant="outline">Disconnect</Button>
      </Flex>
    );
  })();

  return <Alert mb={ 6 } status={ address ? 'success' : 'warning' }>{ content }</Alert>;
};

export default ContractConnectWallet;
