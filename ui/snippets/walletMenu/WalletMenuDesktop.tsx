import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button, Box, useBoolean, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { useMarketplaceContext } from 'lib/contexts/marketplace';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import HashStringShorten from 'ui/shared/HashStringShorten';
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

const WalletMenuDesktop = ({ isHomePage, className, size = 'md' }: Props) => {
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen, openModal } = useWallet({ source: 'Header' });
  const { themedBackground, themedBackgroundOrange, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);
  const isMobile = useIsMobile();
  const { isAutoConnectDisabled } = useMarketplaceContext();

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
      gutter={ 10 }
      isLazy
      isOpen={ isPopoverOpen }
      onClose={ setIsPopoverOpen.off }
    >
      <Box ml={ 2 }>
        <PopoverTrigger>
          <WalletTooltip
            isDisabled={ isMobile === undefined || isMobile }
            isWalletConnected={ isWalletConnected }
            isAutoConnectDisabled={ isAutoConnectDisabled }
          >
            <Button
              className={ className }
              variant={ variant }
              colorScheme="blue"
              flexShrink={ 0 }
              isLoading={ (isModalOpening || isModalOpen) && !isWalletConnected }
              loadingText="Connect wallet"
              onClick={ isWalletConnected ? openPopover : connect }
              fontSize="sm"
              size={ size }
              { ...buttonStyles }
            >
              { isWalletConnected ? (
                <>
                  <WalletIdenticon address={ address } isAutoConnectDisabled={ isAutoConnectDisabled } mr={ 2 }/>
                  <HashStringShorten hash={ address } isTooltipDisabled/>
                </>
              ) : 'Connect wallet' }
            </Button>
          </WalletTooltip>
        </PopoverTrigger>
      </Box>
      { isWalletConnected && (
        <PopoverContent w="235px">
          <PopoverBody padding="24px 16px 16px 16px">
            <WalletMenuContent
              address={ address }
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

export default chakra(WalletMenuDesktop);
