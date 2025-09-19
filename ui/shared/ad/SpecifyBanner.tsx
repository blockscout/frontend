import { Box, chakra } from '@chakra-ui/react';
import type { SpecifyAd } from '@specify-sh/sdk';
import Specify, { ImageFormat } from '@specify-sh/sdk';
import React from 'react';

import type { BannerProps } from './types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Image } from 'toolkit/chakra/image';

const PUBLISHER_KEY = 'spk_uq51124ciii28vt00f8za4m5hibpuh';

type Props = BannerProps & {
  address: `0x${ string }` | undefined;
  onEmpty: () => void;
  isLoading: boolean;
};

const SpecifyBanner = ({ className, platform, address, onEmpty, isLoading }: Props) => {
  const isMobileViewport = useIsMobile();
  const isMobile = platform === 'mobile' || isMobileViewport;
  const [ ad, setAd ] = React.useState<SpecifyAd | null>(null);
  const [ isFetching, setIsFetching ] = React.useState(true);

  React.useEffect(() => {
    if (address && !isLoading) {
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
        } finally {
          setIsFetching(false);
        }
      };

      fetchContent();
    }
  }, [ address, isMobile, onEmpty, isLoading ]);

  const handleClick = React.useCallback(() => {
    window.open(ad?.ctaUrl, '_blank');
  }, [ ad?.ctaUrl ]);

  const { width, height } = (() => {
    switch (platform) {
      case 'desktop':
        return { width: 728, height: 90 };
      case 'mobile':
        return { width: 320, height: 100 };
      default:
        return { width: undefined, height: undefined };
    }

  })();

  if (isLoading || isFetching) {
    return (
      <Box className={ className }
        h={ height ? `${ height }px` : { base: '100px', lg: '90px' } }
        w={ width ? `${ width }px` : undefined }
      />
    );
  }

  if (!ad) return null;

  return (
    <Image
      src={ ad.imageUrl }
      alt={ ad.headline }
      cursor="pointer"
      onClick={ handleClick }
      className={ className }
      w={ width ? `${ width }px` : undefined }
      h={ height ? `${ height }px` : { base: '100px', lg: '90px' } }
    />
  );
};

export default chakra(SpecifyBanner);
