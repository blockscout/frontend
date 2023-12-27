import { Link, Text, HStack, Tooltip, Box, useBreakpointValue, chakra, shouldForwardProp } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { NavItem } from 'types/client/navigation-items';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isInternalItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';

import NavLinkIcon from './NavLinkIcon';
import useColors from './useColors';
import useNavLinkStyleProps from './useNavLinkStyleProps';

type Props = {
  item: NavItem;
  isCollapsed?: boolean;
  px?: string | number;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ item, isCollapsed, px, className, onClick }: Props) => {
  const isMobile = useIsMobile();
  const colors = useColors();

  const isExpanded = isCollapsed === false;
  const isInternalLink = isInternalItem(item);

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: isInternalLink && item.isActive });
  const isXLScreen = useBreakpointValue({ base: false, xl: true });
  const href = isInternalLink ? route(item.nextRoute) : item.url;

  const content = (
    <Link
      href={ href }
      target={ isInternalLink ? '_self' : '_blank' }
      { ...styleProps.itemProps }
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      display="flex"
      px={ px || { base: 3, lg: isExpanded ? 3 : '15px', xl: isCollapsed ? '15px' : 3 } }
      aria-label={ `${ item.text } link` }
      whiteSpace="nowrap"
      onClick={ onClick }
      _hover={{
        '& *': {
          color: 'link_hovered',
        },
      }}
    >
      <Tooltip
        label={ item.text }
        hasArrow={ false }
        isDisabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isInternalLink && item.isActive ? colors.text.active : colors.text.hover }
      >
        <HStack spacing={ 3 } overflow="hidden">
          <NavLinkIcon item={ item }/>
          <Text { ...styleProps.textProps }>
            <span>{ item.text }</span>
            { !isInternalLink && <IconSvg name="arrows/north-east" boxSize={ 4 } color="text_secondary" verticalAlign="middle"/> }
          </Text>
        </HStack>
      </Tooltip>
    </Link>
  );

  return (
    <Box as="li" listStyleType="none" w="100%" className={ className }>
      { isInternalLink ? (
        <NextLink href={ item.nextRoute } passHref legacyBehavior>
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
