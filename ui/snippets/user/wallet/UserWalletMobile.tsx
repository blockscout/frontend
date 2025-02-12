import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'lib/web3/useAccountWithDomain';
import useWeb3Wallet from 'lib/web3/useWallet';

import UserWalletButton from './UserWalletButton';
import UserWalletMenuContent from './UserWalletMenuContent';

const UserWalletMobile = () => {
  const walletMenu = useDisclosure();

  const web3Wallet = useWeb3Wallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(web3Wallet.isConnected);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending =
    (web3Wallet.isConnected && web3AccountWithDomain.isLoading) ||
    (!web3Wallet.isConnected && web3Wallet.isOpen);

  const handleOpenWalletClick = React.useCallback(() => {
    web3Wallet.openModal();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  const handleDisconnectClick = React.useCallback(() => {
    web3Wallet.disconnect();
    walletMenu.onClose();
  }, [ web3Wallet, walletMenu ]);

  return (
    <>
      <UserWalletButton
        variant="header"
        onClick={ web3Wallet.isConnected ? walletMenu.onOpen : web3Wallet.openModal }
        address={ web3AccountWithDomain.address }
        domain={ web3AccountWithDomain.domain }
        isPending={ isPending }
      />
      { web3AccountWithDomain.address && (
        <Drawer
          isOpen={ walletMenu.isOpen }
          placement="right"
          onClose={ walletMenu.onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="300px">
            <DrawerBody p={ 6 }>
              <UserWalletMenuContent
                address={ web3AccountWithDomain.address }
                domain={ web3AccountWithDomain.domain }
                isAutoConnectDisabled={ isAutoConnectDisabled }
                isReconnecting={ web3Wallet.isReconnecting }
                onOpenWallet={ handleOpenWalletClick }
                onDisconnect={ handleDisconnectClick }
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default React.memo(UserWalletMobile);
