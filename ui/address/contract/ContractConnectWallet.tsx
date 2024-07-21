import { Alert, Button, Flex } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import useWallet from 'ui/snippets/walletMenu/useWallet';

const ContractConnectWallet = () => {
  const { t } = useTranslation('common');

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
            loadingText={ t('Connect_wallet') }
          >
            { t('Connect_wallet') }
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
        <Button onClick={ disconnect } size="sm" variant="outline">{ t('Disconnect') }</Button>
      </Flex>
    );
  })();

  return <Alert mb={ 6 } status={ address ? 'success' : 'warning' }>{ content }</Alert>;
};

export default ContractConnectWallet;
