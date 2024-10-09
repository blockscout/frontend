import { Flex, Box, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import colors from 'theme/foundations/colors';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import IconSvg from 'ui/shared/IconSvg';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const hasAccount = useHasAccount();

  const [ isCollapsed, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const handleContainerClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleTogglerClick();
    }
  }, [ handleTogglerClick ]);

  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blackAlpha.400', colors.grayTrue[200]), //'whiteAlpha.400'
    borderColor: 'divider',
  };

  const isExpanded = isCollapsed === false;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      role="group"
      position="relative"
      flexDirection="column"
      alignItems="stretch"
      borderRight="1px solid"
      borderColor="divider"
      px={{ lg: isExpanded ? 6 : 4, xl: isCollapsed ? 4 : 6 }}
      py={ 12 }
      width={{ lg: isExpanded ? '229px' : '80px', xl: isCollapsed ? '80px' : '229px' }}
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
      onClick={ handleContainerClick }
    >
      <TestnetBadge position="absolute" pl={ 3 } w="49px" top="34px"/>
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        pl={{ lg: isExpanded ? 0 : '9px', xl: isCollapsed ? '9px' : 0 }}
        pr={{ lg: isExpanded ? 0 : '8px', xl: isCollapsed ? '8px' : 0 }}
        h={ 10 }
        transitionProperty="padding"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        { Boolean(config.UI.navigation.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>
      <Box as="nav" mt={ 6 } w="100%">
        <VStack as="ul" spacing="1" alignItems="flex-start">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroup key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            }
          }) }
        </VStack>
      </Box>
      { hasAccount && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 3 } pt={ 3 }>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </VStack>
        </Box>
      ) }
      <IconSvg
        name="arrows/east-mini"
        width={ 6 }
        height={ 6 }
        border="1px"
        _hover={{ color: 'white' }}
        borderRadius="base"
        { ...chevronIconStyles }
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={{ lg: isExpanded ? '216px' : '68px', xl: isCollapsed ? '68px' : '216px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
        display="none"
        _groupHover={{ display: 'block' }}
      />
    </Flex>
  );
};

export default NavigationDesktop;
