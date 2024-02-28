import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import IconSvg from 'ui/shared/IconSvg';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';
import WalletTooltip from './WalletTooltip';

const WalletMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet({ source: 'Header' });
  const { themedBackground, themedBorderColor, themedColor } = useMenuButtonColors();
  const isMobile = useIsMobile();

  const openPopover = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, { Action: 'Open' });
    onOpen();
  }, [ onOpen ]);

  return (
    <>
      <WalletTooltip isDisabled={ isWalletConnected || isMobile === undefined || !isMobile } isMobile>
        <IconButton
          aria-label="wallet menu"
          icon={ isWalletConnected ?
            <AddressIdenticon size={ 20 } hash={ address }/> :
            <IconSvg name="wallet" boxSize={ 6 }/>
          }
          variant={ isWalletConnected ? 'subtle' : 'outline' }
          colorScheme="gray"
          boxSize="40px"
          flexShrink={ 0 }
          bg={ isWalletConnected ? themedBackground : undefined }
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
              <WalletMenuContent address={ address } disconnect={ disconnect }/>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

export default WalletMenuMobile;
