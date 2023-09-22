import { Flex, chakra, Tooltip, Image } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

import type { AdCustomConfig } from 'types/client/ad';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

import useIsMobile from '../../../lib/hooks/useIsMobile';

const CustomAdBanner = ({ className }: { className?: string }) => {
  const isMobile = useIsMobile();

  const feature = config.features.adsBanner;
  const configUrl = (feature.isEnabled && feature.provider === 'custom') ? feature.configUrl : '';

  const apiFetch = useFetch();
  const { data: adConfig } = useQuery<unknown, ResourceError<unknown>, AdCustomConfig>(
    [ 'custom-configs' ],
    async() => apiFetch(configUrl),
    {
      enabled: feature.isEnabled && feature.provider === 'custom',
      staleTime: Infinity,
    });
  const interval = adConfig?.interval || 60000;
  const banners = adConfig?.banners || [];

  const [ currentBannerIndex, setCurrentBannerIndex ] = useState(0);
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
  }, [ interval, banners.length ]);

  if (banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentBannerIndex];

  return (
    <Flex className={ className } h="90px">
      <Tooltip label={ currentBanner.text } aria-label={ currentBanner.text }>
        <a href={ currentBanner.url } target="_blank" rel="noopener noreferrer">
          <Image src={ isMobile ? currentBanner.mobile : currentBanner.desktop } alt={ currentBanner.text } height="100%" width="auto" borderRadius="md"/>
        </a>
      </Tooltip>
    </Flex>
  );
};

export default chakra(CustomAdBanner);
