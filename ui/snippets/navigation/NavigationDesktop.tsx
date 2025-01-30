import { Flex, Box, VStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import chevronIcon from 'icons/arrows/east-mini.svg';
import testnetIcon from 'icons/testnet.svg';
import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import useHasAccount from 'lib/hooks/useHasAccount';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import NetworkMenu from 'ui/snippets/networkMenu/NetworkMenu';

import NavLink from './NavLink';
import NavLinkGroupDesktop from './NavLinkGroupDesktop';

import luxColors from 'theme/foundations/lux-colors';

const NAV_WIDTH = '320px'
const NAV_WIDTH_CLOSED = '92px'

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

  const chevronIconStyles = {
    bgColor: 'transparent',
    color: luxColors.colors.muted2,
  };

  const isExpanded = isCollapsed === false;

  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      flexDirection="column"
      alignItems="stretch"
      borderRight="1px solid"
      borderColor="divider"
      px={{ lg: isExpanded ? 6 : 4, xl: isCollapsed ? 4 : 6 }}
      pb={ 12 }
      pt={ { base: '12px' } }
      width={{ lg: isExpanded ? NAV_WIDTH : NAV_WIDTH_CLOSED, xl: isCollapsed ? NAV_WIDTH_CLOSED : NAV_WIDTH }}
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
      sx={{
        '&:hover #expand-icon': {
          opacity: '1.0',
        },
      }}
    >
      { config.chain.isTestnet && <Icon as={ testnetIcon } h="14px" w="auto" color="red.400" position="absolute" pl={ 3 } top="34px"/> }
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
        { Boolean(config.UI.sidebar.featuredNetworks) && <NetworkMenu isCollapsed={ isCollapsed }/> }
      </Box>
      <Box as="nav" mt={ 8 } w="100%">
        <VStack as="ul" spacing="1" alignItems="flex-start">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroupDesktop key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            }
          }) }
        </VStack>
      </Box>
      { hasAccount && (
        <Box as="nav" borderTopWidth="1px" borderColor="divider" w="100%" mt={ 6 } pt={ 6 }>
          <VStack as="ul" spacing="1" alignItems="flex-start">
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </VStack>
        </Box>
      ) }
      <Icon
        as={ chevronIcon }
        width={ 6 }
        height={ 6 }
        border="none"
        _hover={{ color: luxColors.colors.foreground }}
        bgColor='transparent'
        color={luxColors.colors.muted2}
        sx={{
          opacity: '0.7',   
        }}
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="absolute"
        top="70px"
        left={{ lg: isExpanded ? '12px' : '64px', xl: isCollapsed ? '64px' : '12px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
        id="expand-icon"
      />
    </Flex>
  );
};

export default NavigationDesktop;
