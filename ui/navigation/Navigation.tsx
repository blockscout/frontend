import { Flex, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import logoIcon from 'icons/logo.svg';
import networksIcon from 'icons/networks.svg';

import getDefaultTransitionProps from '../../theme/utils/getDefaultTransitionProps';
import AccountNavigation from './AccountNavigation';
import MainNavigation from './MainNavigation';
import NavFooter from './NavFooter';

const Navigation = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      borderRight="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      px={ 6 }
      py={ 12 }
      width="300px"
      { ...getDefaultTransitionProps() }
    >
      <HStack as="header" justifyContent="space-between" w="100%" px={ 3 } h={ 10 } alignItems="center">
        <Icon
          as={ logoIcon }
          width="113px"
          height="20px"
          color={ useColorModeValue('blue.600', 'white') }
          { ...getDefaultTransitionProps() }
        />
        <Icon
          as={ networksIcon }
          width="16px"
          height="16px"
          color={ useColorModeValue('gray.500', 'white') }
          { ...getDefaultTransitionProps() }
        />
      </HStack>
      <MainNavigation/>
      <AccountNavigation/>
      <NavFooter/>
    </Flex>
  );
};

export default Navigation;
