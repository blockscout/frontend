import { Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, IconButton, useColorModeValue, Icon } from '@chakra-ui/react';
import React from 'react';

import walletIcon from 'icons/wallet.svg';
import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import useWallet from 'ui/snippets/walletMenu/useWallet';
import WalletMenuContent from 'ui/snippets/walletMenu/WalletMenuContent';

const WalletMenuMobile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isWalletConnected, address, connect, disconnect, isModalOpening, isModalOpen } = useWallet();

  const themedBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const themedBorderColor = useColorModeValue('gray.300', 'gray.700');
  const themedColor = useColorModeValue('blackAlpha.800', 'gray.400');

  return (
    <>
      <IconButton
        aria-label="wallet menu"
        icon={ isWalletConnected ?
          <AddressIdenticon size={ 20 } hash={ address }/> :
          <Icon as={ walletIcon } boxSize={ 6 }/>
        }
        variant={ isWalletConnected ? 'subtle' : 'outline' }
        colorScheme="gray"
        boxSize="40px"
        flexShrink={ 0 }
        bg={ isWalletConnected ? themedBackground : undefined }
        color={ themedColor }
        borderColor={ !isWalletConnected ? themedBorderColor : undefined }
        onClick={ isWalletConnected ? onOpen : connect }
        isLoading={ isModalOpening || isModalOpen }
      />
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
