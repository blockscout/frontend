import React from 'react';
import { VStack, HStack, Icon, useColorModeValue } from '@chakra-ui/react';

import AccountNavigation from './AccountNavigation';
import MainNavigation from './MainNavigation';
import NavFooter from './NavFooter';

import logoIcon from 'icons/logo.svg';
import networksIcon from 'icons/networks.svg';

import getDefaultTransitionProps from '../../theme/utils/getDefaultTransitionProps';

const Navigation = () => {
  return (
    <VStack
      alignItems="flex-start"
      spacing={ 12 }
      borderRight="1px solid"
      borderColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') }
      px={ 10 }
      py={ 12 }
      width="300px"
      { ...getDefaultTransitionProps() }
    >
      <HStack as="header" justifyContent="space-between" w="100%" px={ 4 } mb={ 2 } h={ 10 } alignItems="center">
        <Icon
          as={ logoIcon }
          width="142px"
          height="26px"
          color={ useColorModeValue('blue.600', 'white') }
          { ...getDefaultTransitionProps() }
        />
        <Icon
          as={ networksIcon }
          width="20px"
          height="20px"
          color={ useColorModeValue('gray.500', 'white') }
          { ...getDefaultTransitionProps() }
        />
      </HStack>
      <MainNavigation/>
      <AccountNavigation/>
      <NavFooter/>
    </VStack>
  );
};

export default Navigation;
