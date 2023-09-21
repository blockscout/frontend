import { Flex, chakra, Tooltip, Image } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

import useCustomBanners from 'ui/shared/ad/useCustomBanners';

const CustomAdBanner = ({ className }: { className?: string }) => {
  const customBanners = useCustomBanners().data || [];
  const [ currentBannerIndex, setCurrentBannerIndex ] = useState(0);
  useEffect(() => {
    if (customBanners.length === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % customBanners.length);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [ customBanners.length ]);

  if (customBanners.length === 0) {
    return null;
  }

  const currentBanner = customBanners[currentBannerIndex];

  return (
    <>
      <Flex className={ className } h="90px" display={{ base: 'none', lg: 'flex' }}>
        <Tooltip label={ currentBanner.text } aria-label={ currentBanner.text }>
          <a href={ currentBanner.url } target="_blank" rel="noopener noreferrer">
            <Image src={ currentBanner.desktop } alt={ currentBanner.text } height="100%" width="auto" borderRadius="10px"/>
          </a>
        </Tooltip>
      </Flex>
      <Flex className={ className } h="90px" display={{ base: 'flex', lg: 'none' }}>
        <Tooltip label={ currentBanner.text } aria-label={ currentBanner.text }>
          <a href={ currentBanner.url } target="_blank" rel="noopener noreferrer">
            <Image src={ currentBanner.mobile } alt={ currentBanner.text } height="100%" width="auto" borderRadius="10px"/>
          </a>
        </Tooltip>
      </Flex>
    </>
  );
};

export default chakra(CustomAdBanner);
