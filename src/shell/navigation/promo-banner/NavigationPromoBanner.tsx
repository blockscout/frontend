// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, useBreakpointValue, chakra } from '@chakra-ui/react';
import React, { useCallback, useState, useEffect } from 'react';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

import NavigationPromoBannerContent from './NavigationPromoBannerContent';

const PROMO_BANNER_CLOSED_HASH_KEY = 'nav-promo-banner-closed-hash';
const promoBanner = config.shell.navigation.promoBanner;
const isHorizontal = config.shell.navigation.layout === 'horizontal';

type Props = {
  isCollapsed?: boolean;
};

const NavigationPromoBanner = ({ isCollapsed }: Props) => {
  const isMobile = useIsMobile();
  const isXLScreen = useBreakpointValue({ base: false, xl: true });
  const isHorizontalNavigation = isHorizontal && !isMobile;

  const [ isShown, setIsShown ] = useState(false);
  const [ promoBannerHash, setPromoBannerHash ] = useState('');

  useEffect(() => {
    let isActive = true;
    // viem is imported lazily so the nav shell (rendered on every page) keeps it out of the critical
    // bundle; the hash stays byte-identical to before, so existing dismissals survive.
    import('viem').then(({ keccak256, stringToBytes }) => {
      try {
        const promoBannerClosedHash = window.localStorage.getItem(PROMO_BANNER_CLOSED_HASH_KEY);
        const promoBannerHash = keccak256(stringToBytes(JSON.stringify(promoBanner)));
        if (isActive) {
          setIsShown(promoBannerHash !== promoBannerClosedHash);
          setPromoBannerHash(promoBannerHash);
        }
      } catch {}
    }).catch(() => {});
    return () => {
      isActive = false;
    };
  }, []);

  const handleClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    localStorage.setItem(PROMO_BANNER_CLOSED_HASH_KEY, promoBannerHash);
    setIsShown(false);
  }, [ promoBannerHash ]);

  const isTooltipDisabled = isMobile || (!isHorizontalNavigation && (isCollapsed === false || (isCollapsed === undefined && isXLScreen)));

  if (!promoBanner || !isShown) {
    return null;
  }

  return (
    <Flex flex={ 1 } mt={ isHorizontalNavigation ? 0 : 3 } pointerEvents="none">
      <chakra.a
        href={ promoBanner.link_url }
        target="_blank"
        rel="noopener noreferrer"
        pointerEvents="auto"
        w="full"
        minW={ isHorizontalNavigation ? 'auto' : '60px' }
        mt="auto"
        position={ isHorizontalNavigation ? undefined : 'sticky' }
        bottom={ isHorizontalNavigation ? undefined : { base: 0, lg: 6 } }
        overflow="hidden"
        _hover={{
          opacity: 0.8,
          _icon: {
            display: 'block',
          },
        }}
      >
        <Tooltip
          content={ !isTooltipDisabled && (
            <NavigationPromoBannerContent
              isCollapsed={ false }
              isHorizontalNavigation={ false }
            />
          ) }
          showArrow={ false }
          positioning={{
            placement: isHorizontalNavigation ? 'bottom' : 'right-end',
            offset: { crossAxis: 0, mainAxis: isHorizontalNavigation ? 8 : 5 },
          }}
          contentProps={{
            p: 0,
            borderRadius: 'base',
            bgColor: 'transparent',
            boxShadow: isHorizontalNavigation ? '2xl' : 'none',
            cursor: 'default',
          }}
          interactive
        >
          <Box w="full" position="relative">
            <NavigationPromoBannerContent
              isCollapsed={ isCollapsed }
              isHorizontalNavigation={ isHorizontalNavigation }
            />
            <SpriteIcon
              onClick={ handleClose }
              name="close"
              boxSize={ 3 }
              color={{ _light: 'gray.300', _dark: 'gray.600' }}
              bgColor="bg.primary"
              borderBottomLeftRadius="sm"
              borderTopRightRadius="sm"
              position="absolute"
              top="0"
              right="0"
              display={ isMobile ? 'block' : 'none' }
            />
          </Box>
        </Tooltip>
      </chakra.a>
    </Flex>
  );
};

export default NavigationPromoBanner;
