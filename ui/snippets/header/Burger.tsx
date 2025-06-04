import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { DrawerBody, DrawerContent, DrawerRoot, DrawerTrigger } from 'toolkit/chakra/drawer';
import { IconButton } from 'toolkit/chakra/icon-button';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';
import NavigationMobile from 'ui/snippets/navigation/mobile/NavigationMobile';
import RollupStageBadge from 'ui/snippets/navigation/RollupStageBadge';
import TestnetBadge from 'ui/snippets/navigation/TestnetBadge';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenuButton from 'ui/snippets/networkMenu/NetworkMenuButton';
import NetworkMenuContentMobile from 'ui/snippets/networkMenu/NetworkMenuContentMobile';
import useNetworkMenu from 'ui/snippets/networkMenu/useNetworkMenu';

interface Props {
  isMarketplaceAppPage?: boolean;
}

const Burger = ({ isMarketplaceAppPage }: Props) => {
  const { open, onOpen, onClose, onOpenChange } = useDisclosure();
  const networkMenu = useNetworkMenu();

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    networkMenu.onToggle();
  }, [ networkMenu ]);

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
          <TestnetBadge alignSelf="flex-start"/>
          <RollupStageBadge alignSelf="flex-start"/>
          <Flex alignItems="center" justifyContent="space-between">
            <NetworkLogo onClick={ handleNetworkLogoClick }/>
            { config.UI.navigation.featuredNetworks ? (
              <NetworkMenuButton
                w={ 9 }
                isActive={ networkMenu.open }
                onClick={ handleNetworkMenuButtonClick }
              />
            ) : <Box boxSize={ 9 }/> }
          </Flex>
          { networkMenu.open ?
            <NetworkMenuContentMobile tabs={ networkMenu.availableTabs } items={ networkMenu.data }/> :
            <NavigationMobile onNavLinkClick={ onClose } isMarketplaceAppPage={ isMarketplaceAppPage }/>
          }
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Burger;
