import { Link, Icon, Text, HStack, Tooltip, Box, useBreakpointValue, chakra, shouldForwardProp } from '@chakra-ui/react';
import NextLink from 'next/link';
import { route } from 'nextjs-routes';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import type { NavItem } from 'lib/hooks/useNavItems';
import { isInternalItem } from 'lib/hooks/useNavItems';

import useColors from './useColors';
import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = {
  item: NavItem;
  isCollapsed?: boolean;
  px?: string | number;
  className?: string;
}

const NavLink = ({ item, isCollapsed, px, className }: Props) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: isInternalItem(item) && item.isActive });

  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  let href: string| undefined;

  const isInternal = isInternalItem(item);

  if (isInternal) {
    href = !item.isNewUi ? route(item.nextRoute) : undefined;
  } else {
    href = item.url;
  }

  const content = (
    <Link
      href={ href }
      target={ isInternal ? '_self' : '_blank' }
      { ...styleProps.itemProps }
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      display="flex"
      px={ px || { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
      aria-label={ `${ item.text } link` }
      whiteSpace="nowrap"
    >
      <Tooltip
        label={ item.text }
        hasArrow={ false }
        isDisabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isInternalItem(item) && item.isActive ? colors.text.active : colors.text.hover }
      >
        <HStack spacing={ 3 } overflow="hidden">
          <Icon as={ item.icon } boxSize="30px"/>
          <Text { ...styleProps.textProps }>
            { item.text }
          </Text>
        </HStack>
      </Tooltip>
    </Link>
  );

  return (
    <Box as="li" listStyleType="none" w="100%" className={ className }>
      { /* why not NextLink in all cases? since prev UI and new one are hosting in the same domain and global routing is managed by nginx */ }
      { /* we have to hard reload page on every transition between urls from different part of the app */ }
      { isInternalItem(item) && item.isNewUi ? (
        <NextLink href={ item.nextRoute } passHref>
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
