import { Icon, Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import burgerIcon from 'icons/burger.svg';
import testnetIcon from 'icons/testnet.svg';
import NavigationMobile from 'ui/snippets/navigation/NavigationMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenuButton from 'ui/snippets/networkMenu/NetworkMenuButton';
import NetworkMenuContentMobile from 'ui/snippets/networkMenu/NetworkMenuContentMobile';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isNetworkMenuOpened, setNetworkMenuVisibility ] = React.useState(false);

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    setNetworkMenuVisibility((flag) => !flag);
  }, []);

  const handleNetworkLogoClick = React.useCallback((event: React.SyntheticEvent) => {
    isNetworkMenuOpened && event.preventDefault();
    setNetworkMenuVisibility(false);
  }, [ isNetworkMenuOpened ]);

  return (
    <>
      <Box padding={ 2 } onClick={ onOpen }>
        <Icon
          as={ burgerIcon }
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
            <Icon as={ testnetIcon } h="14px" w="auto" color="red.400" alignSelf="flex-start"/>
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo onClick={ handleNetworkLogoClick }/>
              { appConfig.featuredNetworks.length > 0 ? (
                <NetworkMenuButton
                  isMobile
                  isActive={ isNetworkMenuOpened }
                  onClick={ handleNetworkMenuButtonClick }
                />
              ) : <Box boxSize={ 9 }/> }
            </Flex>
            { isNetworkMenuOpened ? <NetworkMenuContentMobile/> : <NavigationMobile/> }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
