import { Icon, Box, Flex, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import burgerIcon from 'icons/burger.svg';
import useNavItems from 'lib/hooks/useNavItems';
import NavFooter from 'ui/navigation/NavFooter';
import NavLink from 'ui/navigation/NavLink';
import NetworkLogo from 'ui/navigation/NetworkLogo';

const Burger = () => {
  const iconColor = useColorModeValue('gray.600', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mainNavItems, accountNavItems } = useNavItems();
  const router = useRouter();

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
            <Flex>
              <NetworkLogo/>
            </Flex>
            <Box as="nav" mt={ 8 }>
              <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
                { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isActive={ router.asPath === item.pathname }/>) }
              </VStack>
            </Box>
            <Box as="nav" mt={ 6 }>
              <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
                { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isActive={ router.asPath === item.pathname }/>) }
              </VStack>
            </Box>
            <NavFooter/>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Burger;
