// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, Box, useBreakpointValue, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { NavItem } from '../types';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Link, LinkExternalIcon } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

import LightningLabel, { LIGHTNING_LABEL_CLASS_NAME } from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { isInternalItem } from '../useNavItems';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavItem;
  onClick?: (e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  isDisabled?: boolean;
};

const NavLink = ({ item, onClick, isCollapsed, isDisabled }: Props) => {
  const isMobile = useIsMobile();

  const isInternalLink = isInternalItem(item);

  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: isInternalLink && item.isActive });
  const isXLScreen = useBreakpointValue({ base: false, xl: true });

  const isHighlighted = checkRouteHighlight(item);

  const content = (
    <>
      <span>{ item.text }</span>
      { !isInternalLink && <LinkExternalIcon _groupHover={{ color: 'icon.secondary' }}/> }
    </>
  );

  return (
    <Box as="li" listStyleType="none" w="100%">
      <Link
        href={ isInternalLink ? route(item.nextRoute) : item.url }
        external={ !isInternalLink }
        noIcon
        { ...styleProps.itemProps }
        w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
        minH="48px"
        fontWeight="500"
        display="flex"
        position="relative"
        px={{ base: 2, lg: isExpanded ? 2 : '15px', xl: isCollapsed ? '15px' : 2 }}
        aria-label={ `${ item.text } link` }
        whiteSpace="nowrap"
        onClick={ onClick }
        _hover={{
          [`& *:not(.${ LIGHTNING_LABEL_CLASS_NAME }, .${ LIGHTNING_LABEL_CLASS_NAME } *)`]: {
            color: isDisabled ? 'inherit' : 'link.navigation.fg.hover',
          },
        }}
      >
        <Tooltip
          content={ content }
          showArrow={ false }
          disabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
          positioning={{ placement: 'right', offset: { crossAxis: 0, mainAxis: 20 } }}
          variant="popover"
          contentProps={{
            color: isInternalLink && item.isActive ? 'link.navigation.fg.selected' : 'link.navigation.fg.hover',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          interactive
        >
          <HStack gap={ 0 } overflow="hidden">
            <NavLinkIcon item={ item } mr={ 3 }/>
            <chakra.span
              { ...styleProps.textProps }
              display={{ base: 'inline-flex', lg: isExpanded ? 'inline-flex' : 'none', xl: isCollapsed ? 'none' : 'inline-flex' }}
              alignItems="center"
            >
              { content }
            </chakra.span>
            { isHighlighted && (
              <LightningLabel
                iconColor={ isInternalLink && item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
                isCollapsed={ isCollapsed }
              />
            ) }
          </HStack>
        </Tooltip>
      </Link>
    </Box>
  );
};

export default React.memo(NavLink);
