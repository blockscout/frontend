import React from 'react';
import { Link, Icon, Text, HStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useColors from './useColors';

interface Props {
  pathname: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const AccountNavLink = ({ text, pathname, icon }: Props) => {
  const router = useRouter();
  const isActive = router.pathname === pathname;

  const colors = useColors();

  return (
    <NextLink href={ pathname } passHref>
      <Link
        as="li"
        listStyleType="none"
        w="220px"
        px={ 4 }
        py={ 2.5 }
        color={ isActive ? colors.text.active : colors.text.default }
        bgColor={ isActive ? colors.bg.active : colors.bg.default }
        _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        borderRadius="base"
      >
        <HStack spacing={ 3 }>
          <Icon as={ icon } boxSize="30px"/>
          <Text>{ text }</Text>
        </HStack>
      </Link>
    </NextLink>
  );
};

export default AccountNavLink;
