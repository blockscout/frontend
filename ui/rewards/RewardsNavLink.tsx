import { Link, Text, HStack, Tooltip, Box, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';
import type { Route } from 'nextjs-routes';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import LightningLabel, { LIGHTNING_LABEL_CLASS_NAME } from 'ui/snippets/navigation/LightningLabel';
import NavLinkIcon from 'ui/snippets/navigation/NavLinkIcon';
import useColors from 'ui/snippets/navigation/useColors';
import useNavLinkStyleProps from 'ui/snippets/navigation/useNavLinkStyleProps';
import { checkRouteHighlight } from 'ui/snippets/navigation/utils';

type Props = {
  isCollapsed?: boolean;
  onClick?: () => void;
}

const RewardsNavLink = ({ isCollapsed, onClick }: Props) => {
  const isMobile = useIsMobile();
  const colors = useColors();
  const router = useRouter();
  const { openLoginModal, dailyRewardQuery, apiToken, isInitialized } = useRewardsContext();

  const pathname = '/account/rewards';
  const nextRoute = { pathname } as Route;

  const isActive = router.pathname === pathname;
  const isExpanded = isCollapsed === false;
  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive });
  const isXLScreen = useBreakpointValue({ base: false, xl: true });
  const isHighlighted = checkRouteHighlight({ nextRoute } as NavItem);

  const handleClick = useCallback(() => {
    if (isInitialized && !apiToken) {
      openLoginModal();
    }
    onClick?.();
  }, [ onClick, isInitialized, apiToken, openLoginModal ]);

  if (!config.features.rewards.isEnabled) {
    return null;
  }

  const content = (
    <Link
      href={ isInitialized && apiToken ? route(nextRoute) : undefined }
      as={ isInitialized && apiToken ? 'a' : 'button' }
      onClick={ handleClick }
      { ...styleProps.itemProps }
      w={{ base: '100%', lg: isExpanded ? '100%' : '60px', xl: isCollapsed ? '60px' : '100%' }}
      display="flex"
      position="relative"
      px={{ base: 2, lg: isExpanded ? 2 : '15px', xl: isCollapsed ? '15px' : 2 }}
      aria-label="Merits link"
      whiteSpace="nowrap"
      _hover={{
        [`& *:not(.${ LIGHTNING_LABEL_CLASS_NAME }, .${ LIGHTNING_LABEL_CLASS_NAME } *)`]: {
          color: isInitialized ? 'link_hovered' : 'inherit',
        },
      }}
    >
      <Tooltip
        label="Merits"
        hasArrow={ false }
        isDisabled={ isMobile || isCollapsed === false || (isCollapsed === undefined && isXLScreen) }
        placement="right"
        variant="nav"
        gutter={ 20 }
        color={ isActive ? colors.text.active : colors.text.hover }
        margin={ 0 }
      >
        <HStack spacing={ 0 } overflow="hidden">
          <NavLinkIcon item={{ icon: dailyRewardQuery.data?.available ? 'merits_with_dot' : 'merits' } as NavItem}/>
          <Text { ...styleProps.textProps } as="span" ml={ 3 }>
            Merits
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
      { isInitialized && apiToken ? (
        <NextLink href={ nextRoute } passHref legacyBehavior>
          { content }
        </NextLink>
      ) : content }
    </Box>
  );
};

export default React.memo(RewardsNavLink);
