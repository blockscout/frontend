import { Box, Flex, Text, Icon, VStack, useColorModeValue } from '@chakra-ui/react';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import React, { useCallback } from 'react';

import appConfig from 'configs/app/config';
import chevronIcon from 'icons/arrows/east-mini.svg';
import * as cookies from 'lib/cookies';
import useNavItems from 'lib/hooks/useNavItems';
import NavFooter from 'ui/snippets/navigation/NavFooter';
import NavLink from 'ui/snippets/navigation/NavLink';

import NavLinkGroupMobile from './NavLinkGroupMobile';

const NavigationMobile = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const [ openedGroupIndex, setOpenedGroupIndex ] = React.useState(-1);

  const x = useMotionValue(0);

  const onGroupItemOpen = (index: number) => () => {
    animate(x, -250);
    setOpenedGroupIndex(index);
  };

  const onGroupItemClose = useCallback(() => {
    animate(x, 0);
    setOpenedGroupIndex(-1);
  }, [ x ]);

  const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
  const hasAccount = appConfig.isAccountSupported && isAuth;

  const iconColor = useColorModeValue('blue.600', 'blue.300');

  return (
    <>
      <Box position="relative">
        <Box
          as={ motion.nav }
          mt={ 6 }
          style={{ x }}
          transitionDuration="100ms"
        >
          <VStack
            w="100%"
            as="ul"
            spacing="1"
            alignItems="flex-start"
          >
            { mainNavItems.map((item, index) => {
              if (item.subItems) {
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
            style={{ x }}
            transitionDuration="100ms"
          >
            <VStack as="ul" spacing="1" alignItems="flex-start">
              { accountNavItems.map((item) => <NavLink key={ item.text } { ...item }/>) }
            </VStack>
          </Box>
        ) }
        <AnimatePresence>
          { openedGroupIndex >= 0 && (
            <Box
              as={ motion.nav }
              mt={ 6 }
              position="absolute"
              top={ 0 }
              initial={{ x: 250 }}
              animate={{ x: 0 }}
              exit={{ x: 250 }}
              transitionDuration="100ms"
              transitionTimingFunction="linear"
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
                { mainNavItems[openedGroupIndex].subItems?.map((item) => <NavLink key={ item.text } { ...item }/>) }
              </VStack>
            </Box>
          ) }
        </AnimatePresence>
      </Box>
      <NavFooter hasAccount={ hasAccount }/>
    </>
  );
};

export default NavigationMobile;
