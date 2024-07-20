import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button, Box, useBoolean, useColorModeValue, Portal } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
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
  const { t } = useTranslation('common');

  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet({ source: 'Header' });
  const { themedBackground, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);
  const isMobile = useIsMobile();

  const defaultColor = useColorModeValue('black', 'white');
  const defaultBackground = useColorModeValue('var(--chakra-colors-gray-200)', 'var(--chakra-colors-whiteAlpha-200)');

  const walletConnectedBackground = useColorModeValue('rgba(255, 255, 255, 1)', 'rgba(35, 35, 35, 1)');
  const walletConnectedBorderColor = useColorModeValue('rgba(230, 230, 231, 1)', 'rgba(66, 66, 68, 1)');
  const walletConnectedColor = useColorModeValue('rgba(17, 17, 17, 1)', 'rgba(255, 255, 255, 1)');

  const variant = React.useMemo(() => {
    if (isWalletConnected) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ isWalletConnected, isHomePage ]);

  let buttonStyles: Partial<ButtonProps> = {};
  if (isWalletConnected) {
    buttonStyles = {
      bg: isHomePage ? walletConnectedBackground : themedBackground,
      color: isHomePage ? walletConnectedColor : themedColor,
      _hover: {
        color: isHomePage ? walletConnectedColor : themedColor,
      },
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: walletConnectedBorderColor,
    };
  } else if (isHomePage) {
    buttonStyles = {
      color: defaultColor,
      background: defaultBackground,
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
              flexShrink={ 0 }
              isLoading={ isModalOpening || isModalOpen }
              loadingText={ t('connect_wallet') }
              onClick={ isWalletConnected ? openPopover : connect }
              fontSize="sm"
              borderRadius="100px"
              { ...buttonStyles }
            >
              { isWalletConnected ? (
                <>
                  <Box mr={ 2 }>
                    <AddressIdenticon size={ 20 } hash={ address }/>
                  </Box>
                  <HashStringShorten hash={ address } isTooltipDisabled/>
                </>
              ) : t('connect_wallet') }
            </Button>
          </PopoverTrigger>
        </Box>
      </WalletTooltip>
      { isWalletConnected && (
        <Portal>
          <PopoverContent w="235px">
            <PopoverBody padding="24px 16px 16px 16px">
              <WalletMenuContent address={ address } disconnect={ disconnect }/>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      ) }
    </Popover>
  );
};

export default WalletMenuDesktop;
