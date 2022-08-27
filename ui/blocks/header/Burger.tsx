import { Icon, Box, Flex, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import burgerIcon from 'icons/burger.svg';
import NavigationMobile from 'ui/blocks/navigation/NavigationMobile';
import NetworkLogo from 'ui/blocks/networkMenu/NetworkLogo';
import NetworkMenuButton from 'ui/blocks/networkMenu/NetworkMenuButton';
import NetworkMenuContentMobile from 'ui/blocks/networkMenu/NetworkMenuContentMobile';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ isNetworkMenuOpened, setNetworkMenuVisibility ] = React.useState(false);

  const handleNetworkMenuButtonClick = React.useCallback(() => {
    setNetworkMenuVisibility((flag) => !flag);
  }, []);

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
      >
        <DrawerOverlay bgColor="blackAlpha.800"/>
        <DrawerContent maxWidth="260px">
          <DrawerBody p={ 6 }>
            <Flex alignItems="center" justifyContent="space-between">
              <NetworkLogo/>
              <NetworkMenuButton
                isCollapsed
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
