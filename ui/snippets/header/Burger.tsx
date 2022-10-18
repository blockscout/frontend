import { Icon, Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import burgerIcon from 'icons/burger.svg';
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
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo onClick={ handleNetworkLogoClick }/>
              <NetworkMenuButton
                isMobile
                isActive={ isNetworkMenuOpened }
                onClick={ handleNetworkMenuButtonClick }
              />
            </Flex>
            { isNetworkMenuOpened ? <NetworkMenuContentMobile/> : <NavigationMobile/> }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
