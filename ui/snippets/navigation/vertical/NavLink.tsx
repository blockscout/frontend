import { Link, Text, HStack, Tooltip, Box, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { isInternalItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel, { LIGHTNING_LABEL_CLASS_NAME } from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useColors from '../useColors';
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
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      display="flex"
      position="relative"
      px={{ base: 2, lg: isExpanded ? 2 : '15px', xl: isCollapsed ? '15px' : 2 }}
      aria-label={ `${ item.text } link` }
      whiteSpace="nowrap"
      onClick={ onClick }
      _hover={{
        [`& *:not(.${ LIGHTNING_LABEL_CLASS_NAME }, .${ LIGHTNING_LABEL_CLASS_NAME } *)`]: {
          color: isDisabled ? 'inherit' : 'link_hovered',
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
        margin={ 0 }
      >
        <HStack spacing={ 0 } overflow="hidden">
          <NavLinkIcon item={ item }/>
          <Text { ...styleProps.textProps } as="span" ml={ 3 }>
            <span>{ item.text }</span>
            { !isInternalLink && <IconSvg name="link_external" boxSize={ 3 } color="icon_link_external" verticalAlign="middle"/> }
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
