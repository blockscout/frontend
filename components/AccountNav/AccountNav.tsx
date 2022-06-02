import React from 'react';
import { Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const AccountNav = () => {
  return (
    <Flex
      w="250px"
      flexDirection="column"
      color="blue.600"
    >
      <NextLink href="/" passHref><Link padding="8px 0px">Home</Link></NextLink>
      <NextLink href="/watchlist" passHref><Link padding="8px 0px" >Watchlist</Link></NextLink>
    </Flex>
  )
}

export default AccountNav;
