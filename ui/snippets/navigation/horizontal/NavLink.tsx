import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import LinkExternal from 'ui/shared/links/LinkExternal';
import LinkInternal from 'ui/shared/links/LinkInternal';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useColors from '../useColors';
import { checkRouteHighlight } from '../utils';

interface Props {
  className?: string;
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ className, item, noIcon }: Props) => {
  const isInternalLink = isInternalItem(item);

  const colors = useColors();
  const color = 'isActive' in item && item.isActive ? colors.text.active : colors.text.default;
  const bgColor = 'isActive' in item && item.isActive ? colors.bg.active : colors.bg.default;

  const Link = isInternalLink ? LinkInternal : LinkExternal;
  const href = isInternalLink ? route(item.nextRoute) : item.url;

  const isHighlighted = checkRouteHighlight(item);

  return (
    <chakra.li
      listStyleType="none"
    >
      <Link
        className={ className }
        href={ href }
        display="flex"
        alignItems="center"
        color={ color }
        bgColor={ bgColor }
        _hover={{ textDecoration: 'none', color: colors.text.hover }}
        w="224px"
        px={ 2 }
        py="9px"
        fontSize="sm"
        lineHeight={ 5 }
        fontWeight={ 500 }
        borderRadius="base"
      >
        { !noIcon && <NavLinkIcon item={ item } mr={ 3 }/> }
        <chakra.span>{ item.text }</chakra.span>
        { isHighlighted && <LightningLabel iconColor={ bgColor } position={{ lg: 'static' }} ml={{ lg: '2px' }} isCollapsed={ false }/> }
      </Link>
    </chakra.li>
  );
};

export default React.memo(chakra(NavLink));
