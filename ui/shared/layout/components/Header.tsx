import type { LinkProps } from '@chakra-ui/react';
import { Box, Link, Button, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { IoMenu } from 'react-icons/io5';
import { MdArrowOutward } from 'react-icons/md';

const HeaderLink: React.FC<LinkProps & { children?: React.ReactNode }> = (props) => {
  return (
    <Link color="black" fontSize="14px" fontWeight="500" _hover={{ color: 'black', textDecoration: 'underline' }} { ...props } >{ props.children }</Link>
  );
};

const Header = () => {
  const [ showMobileMenu, setShowMobileMenu ] = React.useState(false);
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" p="1.5em"
      >
        <Box>
          <Image src="/stats-logo.png" alt="Example" width={ 200 } height={ 300 }/>
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          gap="1em"
          border="1px"
          borderColor="#1414142E"
          borderRadius="1.5em"
          py="0.75em"
          px="1.5em"
          backgroundColor="white"
        >
          <HeaderLink >DASHBOARD</HeaderLink>
          <HeaderLink >DEPLOY SMART CONTRACT</HeaderLink>
          <HeaderLink >INTERACT WITH CONTRACT</HeaderLink>
          <HeaderLink >WHITEPAPER</HeaderLink>
        </Box>
        <Box display={{ base: 'none', md: 'block' }} >
          <Button display="flex" gap="7px" borderRadius="1.5em" backgroundColor="black" >
            <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)" >CONNECT</Text>
            <Box background="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)" borderRadius="2em" p="4px"><MdArrowOutward color="black"/></Box>
          </Button>
        </Box>
        { /* eslint-disable-next-line react/jsx-no-bind */ }
        <Button onClick={ () => setShowMobileMenu(!showMobileMenu) }
          display={{ base: 'block', md: 'none' }}
          _hover={{ backgroundColor: 'transparent' }}
          padding="0"
          background="transparent"
        >
          <IoMenu color="black" size="32"/>
        </Button>
      </Box>
      { showMobileMenu && (
        <Box display="flex" flexDirection="column" background="white" borderRadius="1.5em" padding="20px" >
          <Box display="flex" flexDirection="column" alignItems="center" gap="1em"
            borderRadius="1.5em" py="0.75em" px="1.5em" backgroundColor="white">
            <HeaderLink>DASHBOARD</HeaderLink>
            <HeaderLink>DEPLOY SMART CONTRACT</HeaderLink>
            <HeaderLink>INTERACT WITH CONTRACT</HeaderLink>
            <HeaderLink>WHITEPAPER</HeaderLink>
          </Box>
          <Button display="flex" gap="7px" borderRadius="1.5em" backgroundColor="black" _hover={{ backgroundColor: 'black' }} >
            <Text color="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)" >CONNECT</Text>
            <Box background="linear-gradient(180deg, #FFFFFF 0%, #999999 100%)" borderRadius="2em" p="4px"><MdArrowOutward color="black"/></Box>
          </Button>
        </Box>
      ) }
    </>
  );
};

export default Header;
