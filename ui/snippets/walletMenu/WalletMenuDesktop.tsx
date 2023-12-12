import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button, Box, useBoolean, Tooltip } from '@chakra-ui/react';
import React from 'react';

import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

import useMenuButtonColors from '../useMenuButtonColors';

type Props = {
  isHomePage?: boolean;
};

const WalletMenuDesktop = ({ isHomePage }: Props) => {
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet();
  const { themedBackground, themedBorderColor, themedColor } = useMenuButtonColors();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);
  const [ isTooltipShown, setIsTooltipShown ] = useBoolean(false);

  React.useEffect(() => {
    const wasShown = window.localStorage.getItem('wallet-connect-tooltip-shown');
    if (!wasShown) {
      setIsTooltipShown.on();
      window.localStorage.setItem('wallet-connect-tooltip-shown', 'true');
    }
  }, [ setIsTooltipShown ]);

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

  return (
    <Popover
      openDelay={ 300 }
      placement="bottom-end"
      gutter={ 10 }
      isLazy
      isOpen={ isPopoverOpen }
      onClose={ setIsPopoverOpen.off }
    >
      <Tooltip
        label={ <span>Your wallet is used to interact with<br/>apps and contracts in the explorer</span> }
        textAlign="center"
        padding={ 2 }
        isDisabled={ isWalletConnected }
        openDelay={ 300 }
        isOpen={ isTooltipShown || undefined }
        onClose={ setIsTooltipShown.off }
        display={{ base: 'none', lg: 'flex' }}
      >
        <Box ml={ 2 }>
          <PopoverTrigger>
            <Button
              variant={ variant }
              colorScheme="blue"
              flexShrink={ 0 }
              isLoading={ isModalOpening || isModalOpen }
              loadingText="Connect wallet"
              onClick={ isWalletConnected ? setIsPopoverOpen.on : connect }
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
      </Tooltip>
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
