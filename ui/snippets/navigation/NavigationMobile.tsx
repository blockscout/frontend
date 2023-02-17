import { Box, Flex, Text, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { animate, motion, useMotionValue } from 'framer-motion';
import React, { useCallback } from 'react';

import appConfig from 'configs/app/config';
import chevronIcon from 'icons/arrows/east-mini.svg';
import * as cookies from 'lib/cookies';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import NavFooter from 'ui/snippets/navigation/NavFooter';
import NavLink from 'ui/snippets/navigation/NavLink';

import NavLinkGroupMobile from './NavLinkGroupMobile';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const [ openedGroupIndex, setOpenedGroupIndex ] = React.useState(-1);

  const mainX = useMotionValue(0);
  const subX = useMotionValue(250);

  const onGroupItemOpen = (index: number) => () => {
    setOpenedGroupIndex(index);
    animate(mainX, -250, { ease: 'easeInOut' });
    animate(subX, 0, { ease: 'easeInOut' });
  };

  const onGroupItemClose = useCallback(() => {
    animate(mainX, 0, { ease: 'easeInOut' });
    animate(subX, 250, { ease: 'easeInOut', onComplete: () => setOpenedGroupIndex(-1) });
  }, [ mainX, subX ]);

  const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
  const hasAccount = appConfig.isAccountSupported && isAuth;

  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const openedItem = mainNavItems[openedGroupIndex];

  return (
    <>
      <Box position="relative">
        <Box
          as={ motion.nav }
          mt={ 6 }
          style={{ x: mainX }}
        >
          <VStack
            w="100%"
            as="ul"
            spacing="1"
            alignItems="flex-start"
          >
            { mainNavItems.map((item, index) => {
              if (isGroupItem(item)) {
                return <NavLinkGroupMobile key={ item.text } { ...item } onClick={ onGroupItemOpen(index) }/>;
              } else {
                return <NavLink key={ item.text } { ...item }/>;
              }
            }) }
          </VStack>
        </Box>
        { isAuth && (
          <Box
            as={ motion.nav }
            mt={ 6 }
            style={{ x: mainX }}
          >
            <VStack as="ul" spacing="1" alignItems="flex-start">
              { accountNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
            </VStack>
          </Box>
        ) }
        { openedGroupIndex >= 0 && (
          <Box
            as={ motion.nav }
            mt={ 6 }
            position="absolute"
            top={ 0 }
            style={{ x: subX }}
            key="sub"
          >
            <VStack
              w="100%"
              as="ul"
              spacing="1"
              alignItems="flex-start"
            >
              <Flex alignItems="center" px={ 3 } py={ 2.5 } w="100%" h="50px" onClick={ onGroupItemClose }>
                <Icon as={ chevronIcon } boxSize={ 6 } mr={ 2 } color={ iconColor }/>
                <Text variant="secondary" fontSize="sm">{ mainNavItems[openedGroupIndex].text }</Text>
              </Flex>
              { isGroupItem(openedItem) && openedItem.subItems?.map((item) => <NavLink key={ item.text } { ...item }/>) }
            </VStack>
          </Box>
        ) }
      </Box>
      <NavFooter hasAccount={ hasAccount }/>
    </>
  );
};

export default NavigationMobile;
