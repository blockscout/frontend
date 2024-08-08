import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, IconButton } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import IconSvg from 'ui/shared/IconSvg';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';
import WalletIdenticon from './WalletIdenticon';
import WalletTooltip from './WalletTooltip';

type ComponentProps = {
  isWalletConnected: boolean;
  address: string;
  connect: () => void;
  disconnect: () => void;
  isModalOpening: boolean;
  isModalOpen: boolean;
  openModal: () => void;
};

export const WalletMenuMobileComponent = (
  { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen, openModal }: ComponentProps,
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor } = useMenuButtonColors();
  const isMobile = useIsMobile();
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const addressQuery = useAddressQuery({ hash: address });

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
            <IconSvg name="wallet" boxSize={ 6 } p={ 0.5 }/>
          }
          variant={ isWalletConnected ? 'subtle' : 'outline' }
          colorScheme="gray"
          boxSize="40px"
          flexShrink={ 0 }
          bg={ isWalletConnected ? themedBg : undefined }
          color={ themedColor }
          borderColor={ !isWalletConnected ? themedBorderColor : undefined }
          onClick={ isWalletConnected ? openPopover : connect }
          isLoading={
            ((isModalOpening || isModalOpen) && !isWalletConnected) ||
            (addressQuery.isPlaceholderData && isWalletConnected)
          }
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
              <WalletMenuContent
                address={ address }
                ensDomainName={ addressQuery.data?.ens_domain_name }
                disconnect={ disconnect }
                isAutoConnectDisabled={ isAutoConnectDisabled }
                openWeb3Modal={ openModal }
                closeWalletMenu={ onClose }
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      ) }
    </>
  );
};

const WalletMenuMobile = () => {
  const {
    isWalletConnected, address, connect, disconnect,
    isModalOpening, isModalOpen, openModal,
  } = useWallet({ source: 'Header' });

  return (
    <WalletMenuMobileComponent
      isWalletConnected={ isWalletConnected }
      address={ address }
      connect={ connect }
      disconnect={ disconnect }
      isModalOpening={ isModalOpening }
      isModalOpen={ isModalOpen }
      openModal={ openModal }
    />
  );
};

export default WalletMenuMobile;
