import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button, Box, useBoolean } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';
import WalletTooltip from './WalletTooltip';

type Props = {
  isHomePage?: boolean;
};

const WalletMenuDesktop = ({ isHomePage }: Props) => {
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet({ source: 'Header' });
  const { themedBackground, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);
  const isMobile = useIsMobile();

  const variant = React.useMemo(() => {
    if (isWalletConnected) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ isWalletConnected, isHomePage ]);

  let buttonStyles: Partial<ButtonProps> = {};
  if (isWalletConnected) {
    buttonStyles = {
      bg: isHomePage ? 'blue.50' : themedBackground,
      color: isHomePage ? 'blackAlpha.800' : themedColor,
      _hover: {
        color: isHomePage ? 'blackAlpha.800' : themedColor,
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
    setIsPopoverOpen.on();
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
      <WalletTooltip isDisabled={ isWalletConnected || isMobile === undefined || isMobile }>
        <Box ml={ 2 }>
          <PopoverTrigger>
            <Button
              variant={ variant }
              colorScheme="blue"
              flexShrink={ 0 }
              isLoading={ isModalOpening || isModalOpen }
              loadingText="Connect wallet"
              onClick={ isWalletConnected ? openPopover : connect }
              fontSize="sm"
              { ...buttonStyles }
            >
              { isWalletConnected ? (
                <>
                  <Box mr={ 2 }>
                    <AddressIdenticon size={ 20 } hash={ address }/>
                  </Box>
                  <HashStringShorten hash={ address } isTooltipDisabled/>
                </>
              ) : 'Connect wallet' }
            </Button>
          </PopoverTrigger>
        </Box>
      </WalletTooltip>
      { isWalletConnected && (
        <PopoverContent w="235px">
          <PopoverBody padding="24px 16px 16px 16px">
            <WalletMenuContent address={ address } disconnect={ disconnect }/>
          </PopoverBody>
        </PopoverContent>
      ) }
    </Popover>
  );
};

export default WalletMenuDesktop;
