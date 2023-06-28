import { Alert, Button, Flex } from '@chakra-ui/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';

const ContractConnectWallet = () => {
  const { address, isDisconnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const isMobile = useIsMobile();

  const handleConnect = React.useCallback(() => {
    openConnectModal?.();
  }, [ openConnectModal ]);

  const handleDisconnect = React.useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  const content = (() => {
    if (isDisconnected || !address) {
      return (
        <>
          <span>Disconnected</span>
          <Button ml={ 3 } onClick={ handleConnect } size="sm" variant="outline">Connect wallet</Button>
        </>
      );
    }

    return (
      <Flex columnGap={ 3 } rowGap={ 3 } alignItems={{ base: 'flex-start', lg: 'center' }} flexDir={{ base: 'column', lg: 'row' }}>
        <Flex alignItems="center">
          <span>Connected to </span>
          <AddressIcon address={{ hash: address, is_contract: false, implementation_name: null }} mx={ 2 }/>
          <AddressLink type="address" fontWeight={ 600 } hash={ address } truncation={ isMobile ? 'constant' : 'dynamic' }/>
        </Flex>
        <Button onClick={ handleDisconnect } size="sm" variant="outline">Disconnect</Button>
      </Flex>
    );
  })();

  return <Alert mb={ 6 } status={ address ? 'success' : 'warning' }>{ content }</Alert>;
};

export default ContractConnectWallet;
