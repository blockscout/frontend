import React from 'react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  pathname: string;
  text: string;
}

const AccountNavLink = ({ text, pathname }: Props) => {
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
        { text }
      </Link>
    </NextLink>
  )
}

export default AccountNavLink;
