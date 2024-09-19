import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3Wallet from 'lib/web3/useWallet';
import useWeb3AccountWithDomain from 'ui/snippets/profile/useWeb3AccountWithDomain';

import WalletButton from './WalletButton';
import WalletMenuContent from './WalletMenuContent';

const WalletMobile = () => {
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
      <WalletButton
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
              <WalletMenuContent
                address={ web3AccountWithDomain.address }
                domain={ web3AccountWithDomain.domain }
                isAutoConnectDisabled={ isAutoConnectDisabled }
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

export default React.memo(WalletMobile);
