import { HStack, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Identicon from 'react-identicons';

import ColorModeToggler from './ColorModeToggler';
import styles from './Header.module.css';
import SearchBar from './SearchBar';

const Header = () => {
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
      <SearchBar/>
      <ColorModeToggler/>
      <Center minWidth="50px" width="50px" height="50px" bg={ useColorModeValue('blackAlpha.100', 'white') } borderRadius="50%" overflow="hidden">
        { /* the displayed size is 48px, but we need to generate x2 for retina displays */ }
        <Identicon className={ styles.identicon } string="randomness" size={ 96 }/>
      </Center>
    </HStack>
  );
};

export default Header;
