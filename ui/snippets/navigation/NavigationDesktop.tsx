import { Flex, Box, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import appConfig from 'configs/app/config';
import chevronIcon from 'icons/arrows/east-mini.svg';
import { useAppContext } from 'lib/appContext';
import * as cookies from 'lib/cookies';
import useNavItems from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import NavFooter from './NavFooter';
import NavLink from './NavLink';

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

  const hasAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN, cookiesString));

  const { mainNavItems, accountNavItems } = useNavItems();

  const hasAccount = hasAuth && appConfig.isAccountSupported;
  const [ isCollapsed, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const containerBorderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const chevronIconStyles = {
    bgColor: useColorModeValue('white', 'black'),
    color: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
    borderColor: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
  };

  const isExpanded = isCollapsed === false;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      flexDirection="column"
      alignItems="flex-start"
      borderRight="1px solid"
      borderColor={ containerBorderColor }
      px={{ lg: isExpanded ? 6 : 4, xl: isCollapsed ? 4 : 6 }}
      py={ 12 }
      width={{ lg: isExpanded ? '229px' : '92px', xl: isCollapsed ? '92px' : '229px' }}
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      <Box
        as="header"
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
        w="100%"
        px={ isCollapsed ? '15px' : 3 }
        h={ 10 }
        { ...getDefaultTransitionProps({ transitionProperty: 'padding' }) }
      >
        <NetworkLogo isCollapsed={ isCollapsed }/>
        <NetworkMenu isCollapsed={ isCollapsed }/>
      </Box>
      <Box as="nav" mt={ 8 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed }/>) }
        </VStack>
      </Box>
      { hasAccount && (
        <Box as="nav" mt={ 12 }>
          <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
            { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed }/>) }
          </VStack>
        </Box>
      ) }
      <NavFooter isCollapsed={ isCollapsed } hasAccount={ hasAccount }/>
      <Icon
        as={ chevronIcon }
        width={ 6 }
        height={ 6 }
        border="1px"
        _hover={{ color: 'blue.400' }}
        borderRadius="base"
        { ...chevronIconStyles }
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={{ lg: isExpanded ? '216px' : '80px', xl: isCollapsed ? '80px' : '216px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
      />
    </Flex>
  );
};

export default NavigationDesktop;
