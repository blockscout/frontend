import { ChevronLeftIcon } from '@chakra-ui/icons';
import { Flex, Icon, Box, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import logoIcon from 'icons/logo.svg';
import networksIcon from 'icons/networks.svg';
import privateTagIcon from 'icons/privattags.svg';
import publicTagIcon from 'icons/publictags.svg';
import tokensIcon from 'icons/token.svg';
import transactionsIcon from 'icons/transactions.svg';
import watchlistIcon from 'icons/watchlist.svg';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import NavFooter from './NavFooter';
import NavLink from './NavLink';

const mainNavItems = [
  { text: 'Blocks', pathname: '/blocks', icon: blocksIcon },
  { text: 'Transactions', pathname: '/transactions', icon: transactionsIcon },
  { text: 'Tokens', pathname: '/tokens', icon: tokensIcon },
  { text: 'Apps', pathname: '/apps', icon: appsIcon },
  { text: 'Other', pathname: '/other', icon: gearIcon },
];

const accountNavItems = [
  { text: 'Watchlist', pathname: '/watchlist', icon: watchlistIcon },
  { text: 'Private tags', pathname: '/private-tags', icon: privateTagIcon },
  { text: 'Public tags', pathname: '/public-tags', icon: publicTagIcon },
  { text: 'API keys', pathname: '/api-keys', icon: apiKeysIcon },
  { text: 'Custom ABI', pathname: '/custom-abi', icon: abiIcon },
];

const Navigation = () => {
  const [ isCollapsed, setCollapsedState ] = React.useState(false);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
  }, []);

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
        <Icon
          as={ networksIcon }
          width="16px"
          height="16px"
          color={ useColorModeValue('gray.500', 'white') }
          marginLeft={ isCollapsed ? '0px' : '27px' }
          { ...getDefaultTransitionProps({ transitionProperty: 'margin' }) }
        />
      </Box>
      <Box as="nav" mt={ 14 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { mainNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed }/>) }
        </VStack>
      </Box>
      <Box as="nav" mt={ 12 }>
        <VStack as="ul" spacing="2" alignItems="flex-start" overflow="hidden">
          { accountNavItems.map((item) => <NavLink key={ item.text } { ...item } isCollapsed={ isCollapsed }/>) }
        </VStack>
      </Box>
      <NavFooter isCollapsed={ isCollapsed }/>
      <ChevronLeftIcon
        width={ 6 }
        height={ 6 }
        bgColor={ useColorModeValue('white', 'black') }
        border="1px"
        color={ useColorModeValue('blackAlpha.400', 'whiteAlpha.400') }
        borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
        borderRadius="base"
        transform={ isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }
        { ...getDefaultTransitionProps({ transitionProperty: 'transform' }) }
        transformOrigin="center"
        position="absolute"
        top="104px"
        right={ -3 }
        cursor="pointer"
        onClick={ handleTogglerClick }
      />
    </Flex>
  );
};

export default Navigation;
