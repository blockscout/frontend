import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useWeb3AccountWithDomain from 'ui/snippets/profile/useWeb3AccountWithDomain';
import useWallet from 'ui/snippets/walletMenu/useWallet';

import WalletButton from './WalletButton';
import WalletMenuContent from './WalletMenuContent';

const WalletMobile = () => {
  const walletMenu = useDisclosure();

  const walletUtils = useWallet({ source: 'Header' });
  const web3AccountWithDomain = useWeb3AccountWithDomain(walletUtils.isWalletConnected);
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const isPending =
    (walletUtils.isWalletConnected && web3AccountWithDomain.isLoading) ||
    (!walletUtils.isWalletConnected && (walletUtils.isModalOpening || walletUtils.isModalOpen));

  const handleOpenWalletClick = React.useCallback(() => {
    walletUtils.openModal();
    walletMenu.onClose();
  }, [ walletUtils, walletMenu ]);

  const handleDisconnectClick = React.useCallback(() => {
    walletUtils.disconnect();
    walletMenu.onClose();
  }, [ walletUtils, walletMenu ]);

  return (
    <>
      <WalletButton
        variant="header"
        onClick={ walletUtils.isWalletConnected ? walletMenu.onOpen : walletUtils.openModal }
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
