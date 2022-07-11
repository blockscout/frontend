import React from 'react';
import { Link, Icon, Text, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  pathname: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const AccountNavLink = ({ text, pathname, icon }: Props) => {
  const router = useRouter();
  const isActive = router.pathname === pathname;

  return (
    <NextLink href={ pathname } passHref>
      <Link
        as="li"
        listStyleType="none"
        w="220px"
        px={ 4 }
        py={ 2.5 }
        color={ isActive ? 'blue.700' : 'gray.600' }
        bgColor={ isActive ? 'blue.50' : 'transparent' }
        _hover={{ color: 'blue.400' }}
        borderRadius="base"
      >
        <HStack spacing={ 3 }>
          <Icon as={ icon } boxSize="30px"/>
          <Text>{ text }</Text>
        </HStack>
      </Link>
    </NextLink>
  )
}

export default AccountNavLink;
