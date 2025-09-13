import { chakra } from '@chakra-ui/react';
import type { SpecifyAd } from '@specify-sh/sdk';
import Specify, { ImageFormat } from '@specify-sh/sdk';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Image } from 'toolkit/chakra/image';

const PUBLISHER_KEY = 'spk_1dqfv5mkgwpwl58zcaziklpurezud8';

const SpecifyBanner = ({ className, platform, address, onEmpty }: BannerProps & { address: string; onEmpty: () => void }) => {
  const isMobileViewport = useIsMobile();
  const isMobile = platform === 'mobile' || isMobileViewport;
  const [ ad, setAd ] = React.useState<SpecifyAd | null>(null);
  React.useEffect(() => {
    const fetchContent = async() => {
      try {
        const specify = new Specify({
          publisherKey: PUBLISHER_KEY,
        });
        const content = await specify.serve(
          [ address as `0x${ string }` ],
          { imageFormat: isMobile ? ImageFormat.SHORT_BANNER : ImageFormat.LONG_BANNER },
        );
        if (content?.imageUrl) {
          setAd(content);
        } else {
          onEmpty();
        }
      } catch (error) {
        onEmpty();
      }
    };

    fetchContent();
  }, [ address, isMobile, onEmpty ]);

  const handleClick = React.useCallback(() => {
    window.open(ad?.ctaUrl, '_blank');
  }, [ ad?.ctaUrl ]);

  if (!ad) return null;

  return (
    <Image
      src={ ad.imageUrl }
      alt={ ad.headline }
      cursor="pointer"
      onClick={ handleClick }
      className={ className }
    />
  );
};

export default chakra(SpecifyBanner);
