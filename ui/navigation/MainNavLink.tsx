import React from 'react';
import { Link, Icon, Text, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@chakra-ui/icons'

interface Props {
  pathname: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const MainNavLink = ({ text, pathname, icon }: Props) => {
  const router = useRouter();
  const isActive = router.pathname === pathname;

  return (
    <NextLink href={ pathname } passHref>
      <Link
        w="220px"
        p="15px 20px"
        color={ isActive ? 'blue.600' : 'gray.600' }
        bgColor={ isActive ? 'blue.50' : 'transparent' }
        borderRadius="base"
        _hover={{ color: 'blue.600' }}
      >
        <HStack justifyContent="space-between">
          <HStack spacing={ 3 }>
            <Icon as={ icon } boxSize="30px"/>
            <Text>{ text }</Text>
          </HStack>
          <ChevronRightIcon boxSize={ 6 }/>
        </HStack>
      </Link>
    </NextLink>
  )
}

export default MainNavLink;
