import React from 'react';
import { VStack, HStack, Icon } from '@chakra-ui/react';

import AccountNavigation from './AccountNavigation';
import MainNavigation from './MainNavigation';
import NavFooter from './NavFooter'

import logoIcon from '../../icons/logo.svg';
import networksIcon from '../../icons/networks.svg';

const Navigation = () => {
  return (
    <VStack
      alignItems="flex-start"
      spacing={ 12 }
      borderRight="1px solid"
      borderColor="gray.200"
      px={ 10 }
      py={ 12 }
      width="300px"
    >
      <HStack as="header" justifyContent="space-between" w="100%" px={ 4 } mb={ 2 } h={ 10 } alignItems="center">
        <Icon as={ logoIcon } width="142px" height="26px" color="blue.600"/>
        <Icon as={ networksIcon } width="20px" height="20px"/>
      </HStack>
      <MainNavigation/>
      <AccountNavigation/>
      <NavFooter/>
    </VStack>
  )
}

export default Navigation;
