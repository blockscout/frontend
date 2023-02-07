import { Link, Icon, Text, HStack, Tooltip, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { route } from 'nextjs-routes';
import React from 'react';

import type { NavItem } from 'lib/hooks/useNavItems';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

import useColors from './useColors';

type Props = NavItem & {
  isCollapsed?: boolean;
  px?: string | number;
}

const NavLink = ({ text, nextRoute, icon, isCollapsed, isActive, px, isNewUi }: Props) => {
  const colors = useColors();

  const isExpanded = isCollapsed === false;

  const content = (
    <Link
      { ...(isNewUi ? {} : { href: route(nextRoute) }) }
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      px={ px || { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
      py={ 2.5 }
      display="flex"
      color={ isActive ? colors.text.active : colors.text.default }
      bgColor={ isActive ? colors.bg.active : colors.bg.default }
      _hover={{ color: isActive ? colors.text.active : colors.text.hover }}
      borderRadius="base"
      whiteSpace="nowrap"
      aria-label={ `${ text } link` }
      { ...getDefaultTransitionProps({ transitionProperty: 'width, padding' }) }
    >
      <Tooltip
        label={ text }
        hasArrow={ false }
        isDisabled={ !isCollapsed }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isActive ? colors.text.active : colors.text.hover }
      >
        <HStack spacing={ 3 } overflow="hidden">
          <Icon as={ icon } boxSize="30px"/>
          <Text
            variant="inherit"
            fontSize="sm"
            lineHeight="20px"
            opacity={{ base: '1', lg: isExpanded ? '1' : '0', xl: isCollapsed ? '0' : '1' }}
            transitionProperty="opacity"
            transitionDuration="normal"
            transitionTimingFunction="ease"
          >
            { text }
          </Text>
        </HStack>
      </Tooltip>
    </Link>
  );

  return (
    <Box as="li" listStyleType="none" w="100%">
      { /* why not NextLink in all cases? since prev UI and new one are hosting in the same domain and global routing is managed by nginx */ }
      { /* we have to hard reload page on every transition between urls from different part of the app */ }
      { isNewUi ? (
        <NextLink href={ nextRoute } passHref>
          { content }
        </NextLink>
      ) : content }
    </Box>
  );
};

export default React.memo(NavLink);
