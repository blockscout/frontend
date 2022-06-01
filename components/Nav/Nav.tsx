import React from 'react';
import { Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Nav = () => {
  return (
    <Flex
      w="250px"
      paddingRight="24px"
      flexDirection="column"
      color="blue.600"
    >
      <NextLink href="/"><Link padding="8px 0px">Home</Link></NextLink>
      <NextLink href="/watchlist"><Link padding="8px 0px" >Watchlist</Link></NextLink>
    </Flex>
  )
}

export default Nav;
