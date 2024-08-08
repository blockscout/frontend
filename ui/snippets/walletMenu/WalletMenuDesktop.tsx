import type { ButtonProps } from '@chakra-ui/react';
import { PopoverContent, PopoverBody, PopoverTrigger, Button, Box, useBoolean, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import useAddressQuery from 'ui/address/utils/useAddressQuery';
import Popover from 'ui/shared/chakra/Popover';
import HashStringShorten from 'ui/shared/HashStringShorten';
import IconSvg from 'ui/shared/IconSvg';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';
import WalletIdenticon from './WalletIdenticon';
import WalletTooltip from './WalletTooltip';

type Props = {
  isHomePage?: boolean;
  className?: string;
  size?: 'sm' | 'md';
};

type ComponentProps = Props & {
  isWalletConnected: boolean;
  address: string;
  connect: () => void;
  disconnect: () => void;
  isModalOpening: boolean;
  isModalOpen: boolean;
  openModal: () => void;
};

export const WalletMenuDesktopComponent = ({
  isHomePage, className, size = 'md', isWalletConnected, address, connect,
  disconnect, isModalOpening, isModalOpen, openModal,
}: ComponentProps) => {
  const { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);
  const isMobile = useIsMobile();
  const { isAutoConnectDisabled } = useMarketplaceContext();
  const addressQuery = useAddressQuery({ hash: address });

  const variant = React.useMemo(() => {
    if (isWalletConnected) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ isWalletConnected, isHomePage ]);

  const themedColorForOrangeBg = useColorModeValue('blackAlpha.800', 'whiteAlpha.800');
  let buttonStyles: Partial<ButtonProps> = {};
  if (isWalletConnected) {
    const backgroundColor = isAutoConnectDisabled ? themedBackgroundOrange : themedBackground;
    const color = isAutoConnectDisabled ? themedColorForOrangeBg : themedColor;
    buttonStyles = {
      bg: isHomePage ? 'blue.50' : backgroundColor,
      color: isHomePage ? 'blackAlpha.800' : color,
      _hover: {
        color: isHomePage ? 'blackAlpha.800' : color,
      },
    };
  } else if (isHomePage) {
    buttonStyles = {
      color: 'white',
    };
  } else {
    buttonStyles = {
      borderColor: themedBorderColor,
      color: themedColor,
    };
  }

  const openPopover = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, { Action: 'Open' });
    setIsPopoverOpen.toggle();
  }, [ setIsPopoverOpen ]);

  return (
    <Popover
      openDelay={ 300 }
      placement="bottom-end"
      isLazy
      isOpen={ isPopoverOpen }
      onClose={ setIsPopoverOpen.off }
    >
      <Box ml={ 2 }>
        <PopoverTrigger>
          <WalletTooltip
            isDisabled={ isMobile === undefined || isMobile || isModalOpening || isModalOpen }
            isWalletConnected={ isWalletConnected }
            isAutoConnectDisabled={ isAutoConnectDisabled }
          >
            <Button
              className={ className }
              variant={ variant }
              colorScheme="blue"
              flexShrink={ 0 }
              isLoading={
                ((isModalOpening || isModalOpen) && !isWalletConnected) ||
                (addressQuery.isPlaceholderData && isWalletConnected)
              }
              loadingText="Connect wallet"
              onClick={ isWalletConnected ? openPopover : connect }
              fontSize="sm"
              size={ size }
              px={{ lg: isHomePage ? 2 : 4, xl: 4 }}
              { ...buttonStyles }
            >
              { isWalletConnected ? (
                <>
                  <WalletIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled } mr={ 2 }/>
                  { addressQuery.data?.ens_domain_name ? (
                    <chakra.span>{ addressQuery.data.ens_domain_name }</chakra.span>
                  ) : (
                    <HashStringShorten hash={ address } isTooltipDisabled/>
                  ) }
                </>
              ) : (
                <>
                  <IconSvg display={{ base: isHomePage ? 'inline' : 'none', xl: 'none' }} name="wallet" boxSize={ 6 } p={ 0.5 }/>
                  <chakra.span display={{ base: isHomePage ? 'none' : 'inline', xl: 'inline' }}>Connect wallet</chakra.span>
                </>
              ) }
            </Button>
          </WalletTooltip>
        </PopoverTrigger>
      </Box>
      { isWalletConnected && (
        <PopoverContent w="235px">
          <PopoverBody padding="24px 16px 16px 16px">
            <WalletMenuContent
              address={ address }
              ensDomainName={ addressQuery.data?.ens_domain_name }
              disconnect={ disconnect }
              isAutoConnectDisabled={ isAutoConnectDisabled }
              openWeb3Modal={ openModal }
              closeWalletMenu={ setIsPopoverOpen.off }
            />
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

// separated the useWallet hook from the main component because it's hard to mock it in tests
const WalletMenuDesktop = ({ isHomePage, className, size = 'md' }: Props) => {
  const {
    isWalletConnected, address, connect, disconnect,
    isModalOpening, isModalOpen, openModal,
  } = useWallet({ source: 'Header' });

  return (
    <WalletMenuDesktopComponent
      isHomePage={ isHomePage }
      className={ className }
      size={ size }
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

export default chakra(WalletMenuDesktop);
