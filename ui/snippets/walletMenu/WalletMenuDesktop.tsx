import type { ButtonProps } from '@chakra-ui/react';
import { Popover, PopoverContent, PopoverBody, PopoverTrigger, Button, useColorModeValue, Box, useBoolean } from '@chakra-ui/react';
import React from 'react';

import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import HashStringShorten from 'ui/shared/HashStringShorten';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

type Props = {
  isHomePage?: boolean;
};

const WalletMenuDesktop = ({ isHomePage }: Props) => {
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet();
  const [ isPopoverOpen, setIsPopoverOpen ] = useBoolean(false);

  const variant = React.useMemo(() => {
    if (isWalletConnected) {
      return 'subtle';
    }
    return isHomePage ? 'solid' : 'outline';
  }, [ isWalletConnected, isHomePage ]);

  let buttonStyles: Partial<ButtonProps> = {};
  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBorderColor = useColorModeValue('gray.300', 'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');
  if (isWalletConnected) {
    buttonStyles = {
      bg: isHomePage ? '#EBF8FF' : themedBackground,
      color: isHomePage ? 'blackAlpha.800' : themedColor,
      _hover: {
        color: isHomePage ? 'blackAlpha.800' : themedColor,
      },
    };
  } else if (isHomePage) {
    buttonStyles = {
      color: '#FFFFFF',
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
      <PopoverTrigger>
        <Button
          variant={ variant }
          colorScheme="blue"
          flexShrink={ 0 }
          isLoading={ isModalOpening || isModalOpen }
          loadingText="Connect wallet"
          onClick={ isWalletConnected ? setIsPopoverOpen.on : connect }
          ml={ 3 }
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
