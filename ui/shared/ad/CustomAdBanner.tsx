import { Flex, chakra, Tooltip, Image, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import shuffle from 'lodash/shuffle';
import React, { useState, useEffect } from 'react';

import type { AdCustomConfig } from 'types/client/ad';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import { MINUTE } from 'lib/consts';
import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';

const CustomAdBanner = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();

  const feature = config.features.adsBanner;
  const configUrl = (feature.isEnabled && feature.provider === 'custom') ? feature.configUrl : '';

  const apiFetch = useFetch();
  const { data: adConfig, isLoading, isError } = useQuery<unknown, ResourceError<unknown>, AdCustomConfig>(
    [ 'ad-banner-custom-config' ],
    async() => apiFetch(configUrl),
    {
      enabled: feature.isEnabled && feature.provider === 'custom',
      staleTime: Infinity,
    });

  const interval = adConfig?.interval || MINUTE;
  const baseBanners = adConfig?.banners || [];
  const randomStart = adConfig?.randomStart || false;
  const randomNextAd = adConfig?.randomNextAd || false;
  const banners = randomNextAd ? shuffle(baseBanners) : baseBanners;

  const [ currentBannerIndex, setCurrentBannerIndex ] = useState(
    randomStart ? Math.floor(Math.random() * banners.length) : 0,
  );
  useEffect(() => {
    if (banners.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [ interval, banners.length, randomNextAd ]);
  if (isLoading) {
    return <Skeleton className={ className } width="100%" height="90px"/>;
  }

  if (isError || !adConfig) {
    return (
      <Flex className={ className } h="90px">
      </Flex>
    );
  }

  if (banners.length === 0) {
    return (
      <Flex className={ className } h="90px">
      </Flex>
    );
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <Flex className={ className } h="90px">
      <Tooltip label={ currentBanner.text } aria-label={ currentBanner.text }>
        <a href={ currentBanner.url } target="_blank" rel="noopener noreferrer">
          <Image src={ isMobile ? currentBanner.mobileImageUrl : currentBanner.desktopImageUrl }
            alt={ currentBanner.text } height="100%" width="auto" borderRadius="md"
            fallback={ <Skeleton width={ isMobile ? '270px' : '728px' } height="90px"/> }
          />
        </a>
      </Tooltip>
    </Flex>
  );
};

export default chakra(CustomAdBanner);
