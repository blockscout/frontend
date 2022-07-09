import React from 'react';
import { HStack, InputGroup, Input, InputLeftAddon, InputLeftElement, Center, Switch, useColorMode } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import Identicon from 'react-identicons';

import styles from './Header.module.css';

const Header = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <HStack
      as="header"
      height="60px"
      width="100%"
      alignItems="center"
      justifyContent="center"
      marginTop={ 9 }
      gap={ 12 }
    >
      <InputGroup>
        <InputLeftAddon w="111px">All filters</InputLeftAddon>
        <InputLeftElement w={ 6 } ml="132px" mr={ 2.5 }>
          <SearchIcon w={ 5 } h={ 5 } color="gray.500"/>
        </InputLeftElement>
        <Input paddingInlineStart="50px" placeholder="Search by addresses / transactions /block/ token ... "/>
      </InputGroup>
      <Switch size="lg" onChange={ toggleColorMode }/>
      <Center minWidth="50px" width="50px" height="50px" bg="blackAlpha.100" borderRadius="50%" overflow="hidden">
        { /* the displayed size is 40px, but we need to generate x2 for retina displays */ }
        <Identicon className={ styles.identicon } string="randomness" size={ 80 }/>
      </Center>
    </HStack>
  )
}

export default Header;
