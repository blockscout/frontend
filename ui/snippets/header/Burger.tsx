import { Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';
import NavigationMobile from 'ui/snippets/navigation/NavigationMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenuButton from 'ui/snippets/networkMenu/NetworkMenuButton';
import NetworkMenuContentMobile from 'ui/snippets/networkMenu/NetworkMenuContentMobile';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const networkMenu = useNetworkMenu();

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    networkMenu.onToggle();
  }, [ networkMenu ]);

  const handleNetworkLogoClick = React.useCallback((event: React.SyntheticEvent) => {
    networkMenu.isOpen && event.preventDefault();
    networkMenu.onClose();
  }, [ networkMenu ]);

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen } cursor="pointer">
        <IconSvg
          name="burger"
          boxSize={ 6 }
          display="block"
          color={ iconColor }
          aria-label="Menu button"
        />
      </Box>
      <Drawer
        isOpen={ isOpen }
        placement="left"
        onClose={ onClose }
        autoFocus={ false }
      >
        <DrawerOverlay/>
        <DrawerContent maxWidth="260px">
          <DrawerBody p={ 6 } display="flex" flexDirection="column">
            { config.chain.isTestnet && <IconSvg name="testnet" h="14px" w="37px" color="red.400" alignSelf="flex-start"/> }
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo onClick={ handleNetworkLogoClick }/>
              { config.UI.sidebar.featuredNetworks ? (
                <NetworkMenuButton
                  isMobile
                  isActive={ networkMenu.isOpen }
                  onClick={ handleNetworkMenuButtonClick }
                />
              ) : <Box boxSize={ 9 }/> }
            </Flex>
            { networkMenu.isOpen ?
              <NetworkMenuContentMobile tabs={ networkMenu.availableTabs } items={ networkMenu.data }/> :
              <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
