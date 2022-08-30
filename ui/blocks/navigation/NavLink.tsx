import { Link, Icon, Text, HStack, Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

interface Props {
  isCollapsed?: boolean;
  isActive: boolean;
  pathname: string;
  text: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

const NavLink = ({ text, pathname, icon, isCollapsed, isActive }: Props) => {
  const colors = useColors();
  const isMobile = useIsMobile();
  const width = (() => {
    if (isMobile) {
      return '100%';
    }

    return isCollapsed ? '60px' : '180px';
  })();

  return (
    <NextLink href={ pathname } passHref>
      <Link
        as="li"
        listStyleType="none"
        w={ width }
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
            { !isCollapsed && <Text variant="inherit" fontSize="sm" lineHeight="20px">{ text }</Text> }
          </HStack>
        </Tooltip>
      </Link>
    </NextLink>
  );
};

export default React.memo(NavLink);
