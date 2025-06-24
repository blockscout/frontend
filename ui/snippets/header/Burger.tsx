import { Flex } from '@chakra-ui/react';
import React from 'react';

import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { IconButton } from 'toolkit/chakra/icon-button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import NavigationMobile from 'ui/snippets/navigation/mobile/NavigationMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();
  const networkMenu = useNetworkMenu();

  const handleNetworkLogoClick = React.useCallback((event: React.SyntheticEvent) => {
    networkMenu.open && event.preventDefault();
    networkMenu.onClose();
  }, [ networkMenu ]);

  return (
    <DrawerRoot
      open={ open }
      onOpenChange={ onOpenChange }
      placement="start"
      lazyMount={ false }
    >
      <DrawerTrigger>
        <IconButton onClick={ onOpen } p={ 2 } aria-label="Menu button">
          <IconSvg
            name="burger"
            boxSize={ 6 }
            display="block"
            color={{ _light: 'gray.600', _dark: 'white' }}
          />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent >
        <DrawerBody display="flex" flexDirection="column" overflowX="hidden" overflowY="auto">
          <Flex alignItems="center" justifyContent="space-between">
            <NetworkLogo onClick={ handleNetworkLogoClick }/>
          </Flex>
          <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
