import { Link, Text, HStack, Tooltip, Box, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isInternalItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useColors from '../useColors';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavItem;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  isDisabled?: boolean;
  isMainNav?: boolean
  onMouseOver?: () => void
};

const NavLink = ({ item, onClick, isCollapsed, isMainNav, onMouseOver }: Props) => {
  const isMobile = useIsMobile();
  const colors = useColors();

  const isInternalLink = isInternalItem(item);
  const href = isInternalLink ? route(item.nextRoute) : item.url;

  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: isInternalLink && item.isActive });
  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  const isHighlighted = checkRouteHighlight(item);

  const content = (
    <Link
      href={ href }
      target={ isInternalLink ? '_self' : '_blank' }
      { ...styleProps.itemProps }
      display="flex"
      position="relative"
      px={ !isMainNav ? "12px" : "24px" }
      py={ !isMainNav ? "12px" : "12px"}
      aria-label={ `${ item.text } link` }
      fontSize="12px"
      whiteSpace="nowrap"
      onClick={ onClick }
      _hover={{
        bg: "grey.20",
        borderRadius: "14px"
      }}
      onMouseOver={onMouseOver}
    >
      <Tooltip
        label={ item.text }
        hasArrow={ false }
        isDisabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isInternalLink && item.isActive ? colors.text.active : colors.text.hover }
        margin={ 0 }
      >
        <HStack spacing={ 0 } overflow="hidden">
          {/*@ts-ignore*/}
          {!isMainNav && (item.icon || item.iconComponent) &&
            <Box w={{ base: '36px', lg: '36px' }} display="flex" borderRadius="10px" bg="black" p="6px">
              <NavLinkIcon boxSize="24px" item={ item } color="rgba(255, 255, 255, 0.5)"/>
            </Box>
          }
          <Text { ...styleProps.textProps } as="span" ml={ !isMainNav ? 3 : 0 }>
            <span>{ item.text }</span>
            { !isInternalLink && <IconSvg name="link_external" boxSize={ 3 } color="grey.50" verticalAlign="middle"/> }
          </Text>
          { isHighlighted && (
            <LightningLabel iconColor={ styleProps.itemProps.bgColor } isCollapsed={ isCollapsed }/>
          ) }
        </HStack>
      </Tooltip>
    </Link>
  );

  return (
    <Box as="li" listStyleType="none" w="100%">
      { isInternalLink ? (
        <NextLink href={ item.nextRoute } passHref legacyBehavior>
          { content }
        </NextLink>
      ) : content }
    </Box>
  );
};

export default React.memo(NavLink);
