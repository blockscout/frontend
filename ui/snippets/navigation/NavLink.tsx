import { Link, Icon, Text, HStack, Tooltip, Box, useBreakpointValue, chakra, shouldForwardProp } from '@chakra-ui/react';
import NextLink from 'next/link';
import { route } from 'nextjs-routes';
import React from 'react';

import type { NavItem } from 'lib/hooks/useNavItems';

import useColors from './useColors';
import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = NavItem & {
  isCollapsed?: boolean;
  px?: string | number;
  className?: string;
}

const NavLink = ({ text, nextRoute, icon, isCollapsed, isActive, px, isNewUi, className }: Props) => {
  const colors = useColors();
  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive });

  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  const content = (
    <Link
      { ...(isNewUi ? {} : { href: route(nextRoute) }) }
      { ...styleProps.itemProps }
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      display="flex"
      px={ px || { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
      aria-label={ `${ text } link` }
      whiteSpace="nowrap"
    >
      <Tooltip
        label={ text }
        hasArrow={ false }
        isDisabled={ isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isActive ? colors.text.active : colors.text.hover }
      >
        <HStack spacing={ 3 } overflow="hidden">
          <Icon as={ icon } boxSize="30px"/>
          <Text { ...styleProps.textProps }>
            { text }
          </Text>
        </HStack>
      </Tooltip>
    </Link>
  );

  return (
    <Box as="li" listStyleType="none" w="100%" className={ className }>
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

const NavLinkChakra = chakra(NavLink, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    if (isChakraProp && prop !== 'px') {
      return false;
    }

    return true;
  },
});

export default React.memo(NavLinkChakra);
