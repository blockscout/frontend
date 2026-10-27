// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, chakra } from '@chakra-ui/react';
import type { SpecifyAd } from '@specify-sh/publisher-sdk';
import { ImageFormat } from '@specify-sh/publisher-sdk';
import React from 'react';

import type { BannerProps } from '../types/client';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Image } from 'src/toolkit/chakra/image';

import {
  DESKTOP_BANNER_HEIGHT,
  DESKTOP_BANNER_WIDTH,
  MOBILE_BANNER_WIDTH,
  MOBILE_BANNER_HEIGHT,
} from '../utils/consts';
import { getSpecifyClient } from '../utils/specify-client';

type Props = BannerProps & {
  address: `0x${ string }` | undefined;
  onEmpty: () => void;
  isLoading: boolean;
};

const SpecifyBanner = ({ className, format = 'responsive', address, onEmpty, isLoading }: Props) => {
  const isMobileViewport = useIsMobile();
  const isMobile = format === 'mobile' || (format === 'responsive' && isMobileViewport);
  const [ ad, setAd ] = React.useState<SpecifyAd | null>(null);
  const [ isFetching, setIsFetching ] = React.useState(true);

  React.useEffect(() => {
    if (address) {
      getSpecifyClient().identify(address);
    }
  }, [ address ]);

  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    let isStale = false;
    let isFilled = false;
    const specify = getSpecifyClient();

    const serveAd = async() => {
      try {
        const content = await specify.serve(null, {
          imageFormat: isMobile ? ImageFormat.SHORT_BANNER : ImageFormat.LONG_BANNER,
        });
        if (isStale || isFilled) {
          return;
        }
        if (content?.imageUrl) {
          isFilled = true;
          setAd(content);
        } else {
          onEmpty();
        }
      } catch (error) {
        if (!isStale) {
          onEmpty();
        }
      } finally {
        if (!isStale) {
          setIsFetching(false);
        }
      }
    };

    const unsubscribe = specify.onIdentityChange(() => {
      if (!isStale && !isFilled) {
        serveAd();
      }
    });

    serveAd();

    return () => {
      isStale = true;
      unsubscribe();
    };
  }, [ isMobile, onEmpty, isLoading ]);

  const handleClick = React.useCallback(() => {
    window.open(ad?.ctaUrl, '_blank', 'noopener,noreferrer');
  }, [ ad?.ctaUrl ]);

  const { width, height } = (() => {
    if (isMobile) {
      return { width: MOBILE_BANNER_WIDTH, height: MOBILE_BANNER_HEIGHT };
    }
    return { width: DESKTOP_BANNER_WIDTH, height: DESKTOP_BANNER_HEIGHT };
  })();

  if (isLoading || isFetching) {
    return (
      <Box className={ className }
        h={ height ? `${ height }px` : { base: `${ MOBILE_BANNER_HEIGHT }px`, lg: `${ DESKTOP_BANNER_HEIGHT }px` } }
        w={ width ? `${ width }px` : undefined }
      />
    );
  }

  if (!ad?.imageUrl) return null;

  return (
    <Image
      src={ ad.imageUrl }
      alt={ ad.headline }
      cursor="pointer"
      onClick={ handleClick }
      className={ className }
      w={ width ? `${ width }px` : { base: `${ MOBILE_BANNER_WIDTH }px`, lg: `${ DESKTOP_BANNER_WIDTH }px` } }
      h={ height ? `${ height }px` : { base: `${ MOBILE_BANNER_HEIGHT }px`, lg: `${ DESKTOP_BANNER_HEIGHT }px` } }
    />
  );
};

export default chakra(SpecifyBanner);
