import { Flex, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';

const NavigationDesktop = () => {
  const { mainNavItems, accountNavItems } = useNavItems();

  const isAuth = useIsAuth();

  const isCollapsed = false;
  const isExpanded = isCollapsed === false;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      px={ 12 }
      py={ 2 }
      m="0 auto"
    >
      { /*<TestnetBadge position="absolute" pl={ 3 } w="49px" top="34px"/>*/ }
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        pl={{ lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 }}
        pr={{ lg: isExpanded ? 0 : '15px', xl: isCollapsed ? '15px' : 0 }}
        h={ 10 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        { Boolean(config.UI.navigation.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>
      <Box as="nav">
        <HStack as="ul" spacing="1" alignItems="flex-start">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroup key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            }
          }) }
        </HStack>
      </Box>
      { isAuth && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 3 } pt={ 3 }>
          <HStack as="ul" spacing="1" alignItems="flex-start">
            <NavLinkRewards isCollapsed={ isCollapsed }/>
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </HStack>
        </Box>
      ) }
    </Flex>
  );
};

export default NavigationDesktop;
