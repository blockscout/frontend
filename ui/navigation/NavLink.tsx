import { Link, Icon, Text, HStack, Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

interface Props {
  isCollapsed: boolean;
  pathname: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const NavLink = ({ text, pathname, icon, isCollapsed }: Props) => {
  const router = useRouter();
  const isActive = router.pathname === pathname;

  const colors = useColors();

  return (
    <NextLink href={ pathname } passHref>

      <Link
        as="li"
        listStyleType="none"
        w={ isCollapsed ? '60px' : '180px' }
        px={ isCollapsed ? '15px' : 3 }
        py={ 2.5 }
        color={ isActive ? colors.text.active : colors.text.default }
        bgColor={ isActive ? colors.bg.active : colors.bg.default }
        _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
        borderRadius="base"
        whiteSpace="nowrap"
        { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
      >
        <Tooltip
          label={ text }
          hasArrow={ false }
          isDisabled={ !isCollapsed }
          placement="right"
          variant="nav"
          gutter={ 15 }
          color={ isActive ? colors.text.active : colors.text.hover }
        >
          <HStack spacing={ 3 }>
            <Icon as={ icon } boxSize="30px"/>
            { !isCollapsed && <Text variant="inherit">{ text }</Text> }
          </HStack>
        </Tooltip>
      </Link>
    </NextLink>
  );
};

export default React.memo(NavLink);
