import React from 'react';
import { Link, Icon, Text, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { IconType } from 'react-icons';

interface Props {
  pathname: string;
  text: string;
  icon: IconType;
}

const AccountNavLink = ({ text, pathname, icon }: Props) => {
  const router = useRouter();
  const isActive = router.pathname === pathname;

  return (
    <NextLink href={ pathname } passHref>
      <Link
        w="220px"
        p="15px 20px"
        color={ isActive ? 'white' : 'black' }
        bgColor={ isActive ? 'green.700' : 'transparent' }
        borderRadius="10px"
      >
        <HStack spacing="4">
          <Icon as={ icon } boxSize="5"/>
          <Text>{ text }</Text>
        </HStack>
      </Link>
    </NextLink>
  )
}

export default AccountNavLink;
