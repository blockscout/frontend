import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Flex, Icon, Box, VStack, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import logoIcon from 'icons/logo.svg';
import privateTagIcon from 'icons/privattags.svg';
import publicTagIcon from 'icons/publictags.svg';
import tokensIcon from 'icons/token.svg';
import transactionsIcon from 'icons/transactions.svg';
import watchlistIcon from 'icons/watchlist.svg';
import * as cookies from 'lib/cookies';
import useBasePath from 'lib/hooks/useBasePath';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import NavFooter from './NavFooter';
import NavLink from './NavLink';
import NetworkMenu from './networkMenu/NetworkMenu';

const Navigation = () => {
  const router = useRouter();
  const basePath = useBasePath();

  const mainNavItems = [
    { text: 'Blocks', pathname: basePath + '/blocks', icon: blocksIcon },
    { text: 'Transactions', pathname: basePath + '/transactions', icon: transactionsIcon },
    { text: 'Tokens', pathname: basePath + '/tokens', icon: tokensIcon },
    { text: 'Apps', pathname: basePath + '/apps', icon: appsIcon },
    { text: 'Other', pathname: basePath + '/other', icon: gearIcon },
  ];

  const accountNavItems = [
    { text: 'Watchlist', pathname: basePath + '/account/watchlist', icon: watchlistIcon },
    { text: 'Private tags', pathname: basePath + '/account/private_tags', icon: privateTagIcon },
    { text: 'Public tags', pathname: basePath + '/account/public_tags_request', icon: publicTagIcon },
    { text: 'API keys', pathname: basePath + '/account/api_key', icon: apiKeysIcon },
    { text: 'Custom ABI', pathname: basePath + '/account/custom_abi', icon: abiIcon },
  ];

  const [ isCollapsed, setCollapsedState ] = React.useState(cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED) === 'true');

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const logoColor = useColorModeValue('blue.600', 'white');

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      borderRight="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      px={ isCollapsed ? 4 : 6 }
      py={ 12 }
      width={ isCollapsed ? '92px' : '229px' }
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      <Box
        as="header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        w="100%"
        px={ 3 }
        h={ 10 }
      >
        <Box
          width={ isCollapsed ? '0' : '113px' }
          display="inline-flex"
          overflow="hidden"
          { ...getDefaultTransitionProps({ transitionProperty: 'width' }) }
        >
          <Icon
            as={ logoIcon }
            width="113px"
            height="20px"
            color={ logoColor }
            { ...getDefaultTransitionProps() }
          />
        </Box>
        <NetworkMenu isCollapsed={ isCollapsed }/>
      </Box>
      <Box as="nav" mt={ 14 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <Box as="nav" mt={ 12 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed } isActive={ router.asPath === item.pathname }/>) }
        </VStack>
      </Box>
      <NavFooter isCollapsed={ isCollapsed }/>
      <ChevronLeftIcon
        width={ 6 }
        height={ 6 }
        bgColor={ useColorModeValue('white', 'black') }
        border="1px"
        color={ useColorModeValue('blackAlpha.400', 'whiteAlpha.400') }
        _hover={{ color: 'blue.400' }}
        borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderRadius="base"
        transform={ isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }
        { ...getDefaultTransitionProps({ transitionProperty: 'transform, left' }) }
        transformOrigin="center"
        position="fixed"
        top="104px"
        left={ isCollapsed ? '80px' : '216px' }
        cursor="pointer"
        onClick={ handleTogglerClick }
      />
    </Flex>
  );
};

export default Navigation;
