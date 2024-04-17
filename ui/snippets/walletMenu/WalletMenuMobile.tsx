import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';
import WalletIdenticon from './WalletIdenticon';
import WalletTooltip from './WalletTooltip';

const WalletMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet({ source: 'Header' });
  const { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor } = useMenuButtonColors();
  const isMobile = useIsMobile();
  const { isAutoConnectDisabled } = useMarketplaceContext();

  const openPopover = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, { Action: 'Open' });
    onOpen();
  }, [ onOpen ]);

  const themedBg = isAutoConnectDisabled ? themedBackgroundOrange : themedBackground;

  return (
    <>
      <WalletTooltip
        isDisabled={ isMobile === undefined || !isMobile }
        isMobile
        isWalletConnected={ isWalletConnected }
        isAutoConnectDisabled={ isAutoConnectDisabled }
      >
        <IconButton
          aria-label="wallet menu"
          icon={ isWalletConnected ?
            <WalletIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled }/> :
            <IconSvg name="wallet" boxSize={ 6 }/>
          }
          variant={ isWalletConnected ? 'subtle' : 'outline' }
          colorScheme="gray"
          boxSize="40px"
          flexShrink={ 0 }
          bg={ isWalletConnected ? themedBg : undefined }
          color={ themedColor }
          borderColor={ !isWalletConnected ? themedBorderColor : undefined }
          onClick={ isWalletConnected ? openPopover : connect }
          isLoading={ isModalOpening || isModalOpen }
        />
      </WalletTooltip>
      { isWalletConnected && (
        <Drawer
          isOpen={ isOpen }
          placement="right"
          onClose={ onClose }
          autoFocus={ false }
        >
          <DrawerOverlay/>
          <DrawerContent maxWidth="260px">
            <DrawerBody p={ 6 }>
              <WalletMenuContent address={ address } disconnect={ disconnect } isAutoConnectDisabled={ isAutoConnectDisabled }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default WalletMenuMobile;
